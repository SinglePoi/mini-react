import React from "../core/React.js";

let showBar = false;
function Counter() {
  function Foo() {
    return <div>foo</div>;
  }
  const bar = <p>bar</p>;

  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      Counter
      <div>{showBar ? bar : <Foo></Foo>}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  );
}

const app = function () {
  return (
    <div>
      hi-mini-react
      <Counter></Counter>
      {/* <Counter num={20}></Counter> */}
    </div>
  );
};

export default app;
