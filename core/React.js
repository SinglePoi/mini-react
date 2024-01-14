const textType = "TEXT_ELEMENT";
let nextUnitOfWork = null;

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
        return typeof child === "string" ? createTextNode(child) : child;
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
}

function fiberLoop(deadline) {
  let shouleYield = false;
  while (!shouleYield && nextUnitOfWork) {
    // todo run
    nextUnitOfWork = performfiberOfUnit(nextUnitOfWork);

    shouleYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(fiberLoop);
}

function createDom(type) {
  return type === textType
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber) {
  const children = fiber.props.children;
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

function performfiberOfUnit(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    fiber.parent.dom.append(dom);

    updateProps(dom, fiber.props);
  }

  // Step3 DOM 树转换链表
  initChildren(fiber);

  // Step4 返回下一个任务
  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;
  return fiber.parent?.sibling;
}

requestIdleCallback(fiberLoop);

const React = {
  render,
  createElement,
};

export default React;
