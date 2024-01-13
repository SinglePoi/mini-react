import React from "../core/React";
import { it, describe, expect } from "vitest";

describe("createElement", () => {
  it("返回一个 Element 类型的 vdom", () => {
    const vdom = React.createElement("div", null, "hi-mini-react");

    expect(vdom).toEqual({
      type: "div",
      props: {
        children: [
          {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: "hi-mini-react",
              children: [],
            },
          },
        ],
      },
    });
  });
});
