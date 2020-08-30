export default ({ id, cache, onEntry = () => {}, onExit = () => {} }) => {
    let isComplete = false;
  
    return {
      id,
      isComplete: () => isComplete,
      enter: props => onEntry(),
      update: () => {},
      exit: () => onExit()
    };
  };
  