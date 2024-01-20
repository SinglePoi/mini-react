const textType = "TEXT_ELEMENT";
/**@description 下一个任务 */
let nextUnitOfWork = null;
/**@description work in progress 根结点 */
let wipRoot = null;
/**@description 老的根结点 */
let currentRoot = null;
/**@description 伪枚举 */
const EffectTag = Object.freeze({
  PLACEMENT: "placement",
  UPDATE: "udpate",
});
/**@description 待删除老结点 */
let deletions = [];
/**@description 更新的开始节点 */
let wipFiber = null;
/**@description useStateHooks */
let stateHooks = [];
/**@description 添加的顺序 */
let stateHookIndex = 0;

function createTextNode(text) {
  return {
    type: textType,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  // 描述容器
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };

  nextUnitOfWork = wipRoot;
}

function fiberLoop(deadline) {
  let shouleYield = false;
  while (!shouleYield && nextUnitOfWork) {
    nextUnitOfWork = performfiberOfUnit(nextUnitOfWork);

    // 更新节点的结束标志
    if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      nextUnitOfWork = undefined;
    }

    shouleYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    /**
     * 统一提交意味着只进行一次挂载
     */
    commitRoot();
  }

  requestIdleCallback(fiberLoop);
}

function commitRoot() {
  deletions.forEach(commitDeletion);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = findParent(fiber);
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

/**
 * 逐层查询真实的父节点
 * @param {*} fiber
 * @returns fiber parent
 */
function findParent(fiber) {
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  return fiberParent;
}

/**
 * 递归提交
 * @param {*} fiber 结点
 * @returns void
 */
function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = findParent(fiber);

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === textType
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  // 老的有，新的没有
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  // 新的有，老的没有
  // 新的有，老的不一样
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const event = key.slice(2).toLowerCase();
          dom.removeEventListener(event, prevProps[key]);
          dom.addEventListener(event, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

/**
 * 转换链表
 * @param {*} fiber dom
 * @param {*} children
 */
function reconcileChildren(fiber, children) {
  /**@description 对应的老结点*/
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    /**@description 对比策略就是对比 type */
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber = null;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        sibling: null,
        parent: fiber,
        dom: oldFiber.dom, // 沿用老dom
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          sibling: null,
          parent: fiber,
          dom: null,
          effectTag: "placement",
        };
      }

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }

    /**
     * 下一次循环处理兄弟结点
     */
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }

    if (newFiber) {
      prevChild = newFiber;
    }
  });
  // 如果还存在 oldFiber 需要去删除
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = [];
  stateHookIndex = 0;
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];
  // DOM 树转换链表
  reconcileChildren(fiber, children);
}

function udpateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  // DOM 树转换链表
  reconcileChildren(fiber, children);
}

function performfiberOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    udpateHostComponent(fiber);
  }

  // 返回下一个任务
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(fiberLoop);

function update() {
  let currentFiber = wipFiber;
  return () => {
    // 新容器
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    // 新的根结点
    nextUnitOfWork = wipRoot;
  };
}

function useState(initial) {
  let currentFiber = wipFiber;
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];
  const stateHook = {
    state: oldHook ? oldHook.state : initial,
  };

  stateHookIndex++;
  stateHooks.push(stateHook);

  currentFiber.stateHooks = stateHooks;

  function setState(action) {
    stateHook.state = action(stateHook.state);
    // 新容器
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    // 新的根结点
    nextUnitOfWork = wipRoot;
  }

  return [stateHook.state, setState];
}

const React = {
  render,
  update,
  useState,
  createElement,
};

export default React;
