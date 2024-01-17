const textType = "TEXT_ELEMENT";
let nextUnitOfWork = null;
let root = null;

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
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };

  root = nextUnitOfWork;
}

function fiberLoop(deadline) {
  let shouleYield = false;
  while (!shouleYield && nextUnitOfWork) {
    nextUnitOfWork = performfiberOfUnit(nextUnitOfWork);

    shouleYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && root) {
    /**
     * 统一提交意味着只进行一次挂载
     */
    commitRoot();
  }

  requestIdleCallback(fiberLoop);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === textType
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on")) {
      const event = key.slice(2).toLowerCase();
      dom.addEventListener(event, props[key]);
    }
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }

    prevChild = newFiber;
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  // DOM 树转换链表
  initChildren(fiber, children);
}

function udpateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  // DOM 树转换链表
  initChildren(fiber, children);
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

const React = {
  render,
  createElement,
};

export default React;
