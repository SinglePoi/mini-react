const textType = "TEXT_EMELEMT";

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
  const dom =
    el.type === textType
      ? document.createTextNode("")
      : document.createElement(el.type);

  // props
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  // children
  el.props.children.forEach((child) => {
    render(child, dom);
  });

  container.append(dom);
}

const React = {
  render,
  createElement,
};

export default React;
