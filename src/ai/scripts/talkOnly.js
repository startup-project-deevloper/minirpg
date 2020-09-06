import StateMachine from "../../managers/stateManager";
import aiIdleState from "../../states/aiIdleState";

export default () => {
  const entityStateMachine = StateMachine();
  let brainData = {};

  const behaviours = {
    talkMode: () => {
      // Or, talk animation?
      entityStateMachine.push(
        aiIdleState({
          props: {
            sprite: brainData.sprite
          }
        })
      );
    },
    idle: () => {
      entityStateMachine.push(
        aiIdleState({
          props: {
            sprite: brainData.sprite
          }
        })
      );
    }
  };

  return {
    bootstrap: props => (brainData = { ...props }),
    update: () => entityStateMachine.update(),
    start: () => behaviours.idle(),
    onConvoEnter: () => {
      entityStateMachine.clearStates();
      behaviours.talkMode();
    },
    onConvoExit: () => {
      entityStateMachine.clearStates();
      behaviours.idle();
    }
  };
};
