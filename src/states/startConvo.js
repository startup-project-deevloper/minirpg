
import { emit, EV_CONVOSTART, EV_CONVONEXT } from "../events";
import { keyPressed } from "kontra";

export default ({ id, convoIterator, onEntry = () => {}, onExit = () => {} }) => {
  let currentActors = [];
  let isComplete = false;

  return {
    id,
    isComplete,
    enter: props => {
      currentActors.push(props);
      console.log("Player entered a conversational state:");
      console.log(props);

      // Example starter convo (I'd put the convo id somewhere else)
      const val = convoIterator.goToExact("m1");

      console.log("FIRE EVENT ==>", EV_CONVOSTART);
      emit(EV_CONVOSTART, {
        actorProps: currentActors[0],
        conversationProps: val
      });

      onEntry(props);
    },
    update: () => {
      if (keyPressed("e")) {
        console.log("FIRE EVENT ==>", EV_CONVONEXT);
        emit(EV_CONVONEXT, {
          actorProps: currentActors[0],
          conversationProps: convoIterator.goToNext()
        });
      }
    },
    exit: () => onExit()
  };
};
