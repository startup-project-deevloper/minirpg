import { Vector } from "kontra";
import TinyQueue from "tinyqueue";
import { getRandomIntInclusive } from "../common/helpers";

export default ({ id, cache, onEntry = () => {}, onExit = () => {} }) => {
  const destQueue = new TinyQueue();
  let isComplete = false;

  for (let i = 0; i < 6; i++) {
    destQueue.push(
      Vector(getRandomIntInclusive(30, 160), getRandomIntInclusive(30, 160))
    );
  }

  //destination = destQueue.pop();

  return {
    id,
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: () => {},
    exit: () => onExit()
  };
};
