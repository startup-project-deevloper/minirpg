import onPush from "../input/onPush";

export default ({
  id,
  sprites,
  onEntry = () => {},
  onExit = () => {},
  onNext = () => {}
}) => {
  let isComplete = false;
  const onInteractionPushed = onPush("e", () => onNext());

  return {
    id,
    isComplete: () => isComplete,
    enter: props => {
      console.log("Player entered a conversational state:");
      console.log(props);
      onEntry();
    },
    update: () => {
      onInteractionPushed();

      sprites.map(sprite => {
        if (!sprite.manualAnimation) {
          sprite.playAnimation("idle");
        }
        sprite.update();
      });
    },
    exit: () => onExit()
  };
};
