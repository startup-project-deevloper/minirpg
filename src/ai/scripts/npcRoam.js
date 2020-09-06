import StateMachine from "../../managers/stateManager";
import { wait } from "../../common/aiHelpers";
import { getRandomIntInclusive } from "../../common/helpers";
import aiFollowPathState from "../../states/aiFollowPathState";
import aiIdleState from "../../states/aiIdleState";

export default () => {
  const entityStateMachine = StateMachine();
  let brainData = {};

  const behaviours = {
    talkMode: () => {
      entityStateMachine.push(
        aiIdleState({
          props: {
            sprite: brainData.sprite
          }
        })
      );
    },
    idleAndRoam: () => {
      entityStateMachine.push(
        aiIdleState({
          props: {
            sprite: brainData.sprite
          },
          onEntry: async () => {
            // Sticking this here rather than in update. No idea if it's right.
            await wait(getRandomIntInclusive(500, 1500));
            entityStateMachine.popState("idle");
          },
          onExit: () => behaviours.followPath()
        })
      );
    },
    followPath: () => {
      entityStateMachine.push(
        aiFollowPathState({
          props: brainData,
          onExit: () => {
            // Hmm... this is a bit weird I feel...
            behaviours.idleAndRoam();
          }
        })
      );
    }
  };

  return {
    bootstrap: props => (brainData = { ...props }),
    update: () => entityStateMachine.update(),
    start: () => behaviours.idleAndRoam(),
    onConvoEnter: () => {
      // TODO: Bug, sometimes stops animations when you clear state like this.
      entityStateMachine.clearStates();
      behaviours.talkMode();
    },
    onConvoExit: () => {
      entityStateMachine.clearStates();
      behaviours.idleAndRoam();
    }
  };
};
