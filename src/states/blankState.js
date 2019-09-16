export default ({ id, cache, onEntry = () => {}, onExit = () => {} }) => {
  let isComplete = false;

  return {
    id,
    isComplete,
    enter: props => {
      onEntry();
    },
    update: () => {},
    exit: () => {
      onExit();
    }
  };
};
