import React from "../core/React.js";
// const app = React.createElement("div", { id: "id" }, "app");

let count = 10;
let props = { id: "22222" };
function Counter() {
  function handleClick() {
    // console.log("click", count);
    count++;
    props = {};
    React.update();
  }
  return (
    <div {...props}>
      count: {count}
      <button onClick={handleClick}>click</button>
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
