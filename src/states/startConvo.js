import { setStoreItem, dataAssets } from "kontra";
import UI from "../ui/ui";
import { emit, EV_CONVONEXT, EV_CONVOSTART, EV_CONVOEND } from "../common/events";
import ConversationIterator, { MODES } from "../common/conversationIterator";
import onPush from "../input/onPush";

export default ({
  id,
  startId,
  currentActors,
  onEntry = () => { },
  onExit = () => { },
  onNext = () => { }
}) => {
  let isComplete = false;

  const dataKey = "assets/gameData/conversationData.json";
  const conversationData = dataAssets[dataKey];

  // This is all very confusing, can it be simplified please?
  const conversationController = ConversationIterator({
    conversationData,
    onChatNext: (node, passedProps = {}) =>
      emit(EV_CONVONEXT, { node, passedProps }),
    onChatComplete: exitId => emit(EV_CONVOEND, { exitId }),
    onChainProgress: lastNodeId => {
      setStoreItem("progress", {
        storyProgress: lastNodeId
      });
    }
  });

  const onDisplayText = ({actor: name, text, choices}) =>
    UI.callText(name, text, choices);

  const onDisplayChoice = ({ actor, choices }) => {
    console.log(actor, choices);
  }

  const onFinished = () =>
    UI.reset();

  const onInteractionPushed =
    onPush("e", () => {

      const { mode, ...rest } = !conversationController.isRunning() ?
        conversationController.start(startId, {
          startId,
          currentActors
        }) : conversationController.goToNext();

      switch (mode) {
        case MODES.NEXTNODE:
          onDisplayText(rest);
          break;
        case MODES.AWAITINGINPUT:
          onDisplayChoice(rest);
          break;
        case MODES.JUSTFINISHED:
        case MODES.COMPLETED:
          isComplete = true;
          break;
      }

      // Is this ever used?
      //onNext()
    });

  return {
    id,
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: () => onInteractionPushed(),
    exit: () => onExit()
  };
};
