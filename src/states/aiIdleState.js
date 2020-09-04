export default ({
  props,
  onEntry = () => {},
  onUpdate = () => {},
  onExit = () => {}
}) => {
  let isComplete = false;

  return {
    id: "idle",
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: () => {
      props.sprite.playAnimation("idle");
      props.sprite.advance();
      onUpdate();
    },
    exit: () => onExit()
  };
};
