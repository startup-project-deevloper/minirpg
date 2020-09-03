const wait = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default ({ id, waitFor, sprite, onEntry = () => {}, onExit = () => {} }) => {
  let isComplete = false;

  return {
    id,
    isComplete: () => isComplete,
    enter: async props => {
      onEntry();
      await wait(waitFor);
      isComplete = true;
    },
    update: () => {
      sprite.playAnimation("idle");
    },
    exit: () => onExit()
  };
};
