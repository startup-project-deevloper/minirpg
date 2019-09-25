const top = arr => arr[arr.length - 1];

export default () => {
  let states = [];
  return {
    push: (state, props) => {
      if (!states.some(s => s.id === state.id)) {
        states.push(state);
        top(states).enter(props);
      }
    },
    update: () => {
      const currentState = top(states);
      if (!currentState) return;

      currentState.update();

      // Attempts an auto-complete if internal isComplete has been set somehow.
      if (currentState.isComplete()) {
        currentState.exit();
        states.pop();
      }
    },
    pop: () => {
      // Unlike above, some states may require manual intervention.
      const currentState = top(states);
      currentState.exit();
      states.pop();
    }
  };
};
