import React from "../core/React.js";

let showBar = false;
function Counter() {
  const foo = (
    <div>
      foo
      <div>child</div>
      <div>child2</div>
    </div>
  );
  const bar = <div>bar</div>;

  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      Counter
      <button onClick={handleShowBar}>showBar</button>
      <div>{showBar ? bar : foo}</div>
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
