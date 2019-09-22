import { keyPressed } from "kontra";

export default ({ id, convoIterator, onEntry = () => {}, onExit = () => {}, onNext = () => {} }) => {
  let currentActors = [];
  let isComplete = false;

  return {
    id,
    isComplete,
    enter: props => {
      currentActors.push(props);
      console.log("Player entered a conversational state:");
      console.log(props);
      onEntry({
        actorProps: currentActors[0],
        conversationProps: convoIterator.goToExact("m1")
      });
    },
    update: () => {
      if (keyPressed("e")) {
        onNext({
          actorProps: currentActors[0],
          conversationProps: convoIterator.goToNext()
        });
      }
    },
    exit: () => onExit()
  };
};
