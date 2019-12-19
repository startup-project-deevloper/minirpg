import { setStoreItem, dataAssets } from "kontra";
import UI from "../ui/ui";
import { emit, EV_CONVOEND } from "../common/events";
import ConversationIterator, { MODES } from "../common/conversationIterator";
import onPush from "../input/onPush";

export default ({
  id,
  startId,
  currentActors,
  onEntry = () => { },
  onExit = () => { }
}) => {

  console.log("Start convo:");

  let isComplete = false;

  const dataKey = "assets/gameData/conversationData.json";
  const conversationData = dataAssets[dataKey];

  // This is all very confusing, can it be simplified please?
  const conversationController = ConversationIterator({
    conversationData,
    onChatComplete: exitId => {
      UI.unmount();
      emit(EV_CONVOEND, { exitId })
    },
    onChainProgress: lastNodeId => setStoreItem("progress", {
      storyProgress: lastNodeId
    })
  });

  const onDisplayText = ({ actor: name, text, choices }) =>
    UI.callText({ name, text, choices });

  const onInteractionPushed =
    onPush("e", () => {

      if (UI.isBusy()) return;

      const { mode, ...rest } = !conversationController.isRunning() ?
        conversationController.start(startId, {
          startId,
          currentActors
        }) : conversationController.goToNext();

      if (mode === MODES.NEXTNODE) {
        onDisplayText(rest);
      }

      isComplete = mode === MODES.JUSTFINISHED || mode === MODES.COMPLETED;
    });

  UI.mount({
    onChoiceSelected: choice => {
      console.log("Selected:");
      console.log(choice);
      const { mode, ...rest } = conversationController.goToExact(choice.to);

      if (mode === MODES.NEXTNODE) {
        onDisplayText(rest);
      }

      isComplete = mode === MODES.JUSTFINISHED || mode === MODES.COMPLETED;
    }
  });

  return {
    id,
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: () => onInteractionPushed(),
    exit: () => onExit()
  };
};
