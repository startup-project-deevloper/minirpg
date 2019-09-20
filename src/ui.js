import { h, render, Component, useEffect } from "preact";
import { on, EV_CONVOSTART } from "./events";

const App = () => {
  const onConvoStarted = data => {
    console.log("Conversation started:");
    console.log(data);
  };

  useEffect(() => {
    on(EV_CONVOSTART, () => onConvoStarted);
  }, []);

  return (
    <div>
      <p>Game</p>
    </div>
  );
};

export default () => {
  return {
    start: () => {
      render(App, document.getElementById("ui"));
    }
  };
};
