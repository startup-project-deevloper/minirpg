import { keyPressed } from "kontra";

export default ({
  id,
  sprites,
  onEntry = () => {},
  onExit = () => {},
  onNext = () => {}
}) => {
  let isComplete = false;
  let pushed = false;

  return {
    id,
    isComplete: () => isComplete,
    enter: props => {
      console.log("Player entered a conversational state:");
      console.log(props);
      onEntry();
    },
    update: () => {
      sprites.map(sprite => {
        sprite.playAnimation("idle");
        sprite.update();
      });

      if (keyPressed("e") && !pushed) {
        onNext();
        pushed = true;
      } else if (pushed && !keyPressed("e")) {
        pushed = false;
      }
    },
    exit: () => onExit()
  };
};
