import React from "../core/React.js";
// const app = React.createElement("div", { id: "id" }, "app");
function Counter({ num }) {
  return <div>count: {num}</div>;
}

const app = function () {
  return (
    <div>
      hi-mini-react
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
    </div>
  );
};

export default app;
