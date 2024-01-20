import React from "../core/React.js";

function Foo() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");

  console.log("foo");

  function handleClick() {
    setCount((count) => count + 1);
    setBar("bar");
  }

  return (
    <div>
      <h1>foo</h1>
      {count}
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

const app = function () {
  return (
    <div>
      hi-mini-react
      <Foo></Foo>
    </div>
  );
};

export default app;
