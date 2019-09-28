export default () => {
  let states = [];
  const top = arr => arr[arr.length - 1];

  return {
    push: (state, props) => {
      if (!states.some(s => s.id === state.id)) {
        states.push(state);
        top(states).enter(props);
      }
    },
    update: props => {
      const currentState = top(states);
      if (!currentState) return;

      currentState.update(props);

      if (currentState.isComplete()) {
        currentState.exit();
        states.pop();
      }
    },
    pop: () => {
      const currentState = top(states);
      currentState.exit();
      states.pop();
    }
  };
};
