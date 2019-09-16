export default ({ states = [], startIndex = 0 }) => {
  let currentState = states[startIndex];

  return {
    setState: (stateId, props = {}) => {
      if (currentState.id === stateId) return;

      currentState = states.find(st => st.id === stateId);
      currentState.enter(props);
    },
    update: () => {
      currentState.update();

      if (currentState.isComplete) {
        currentState.exit();
        currentState = states[0];
      }
    }
  };
};
