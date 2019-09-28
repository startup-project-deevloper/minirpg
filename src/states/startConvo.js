import onPush from "../input/onPush";

export default ({
  id,
  onEntry = () => {},
  onExit = () => {},
  onNext = () => {}
}) => {
  let isComplete = false;
  const onInteractionPushed = onPush("e", () => onNext());

  return {
    id,
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: () => onInteractionPushed(),
    exit: () => onExit()
  };
};
