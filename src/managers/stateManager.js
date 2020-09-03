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
        //states.pop(); ???
        // Careful doing this. Kind of breaks the idea of state. Look in to
        // other AI methods rather than state machines as I think they suck
        // when it comes to AI. Fine with other things like curtains though.
        states = states.filter(x => x.id !== currentState.id);
      }
    },
    pop: () => {
      const currentState = top(states);
      currentState.exit();
      states.pop();
    }
  };
};
