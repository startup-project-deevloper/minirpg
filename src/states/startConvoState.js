import { setStoreItem, dataAssets } from "kontra";
import dialogue from "../ui/dialogue";
import { findReplaceString } from "../common/helpers";
import { emit, EV_CONVOEND } from "../common/events";
import ConversationIterator, { MODES } from "../common/conversationIterator";
import onPush from "../input/onPush";

export default ({
  id,
  startId,
  stringVars = [],
  onEntry = () => {},
  onExit = () => {}
}) => {
  console.log("Start convo.");

  let isComplete = false;

  const dataKey = "assets/gameData/conversationData.json";
  const conversationData = dataAssets[dataKey];

  const conversationController = ConversationIterator({
    conversationData,
    onChatComplete: exitId => {
      dialogue.unmount();
      emit(EV_CONVOEND, { exitId });
    },
    onChainProgress: lastNodeId =>
      setStoreItem("progress", {
        storyProgress: lastNodeId
      })
  });

  const onDisplayText = ({ actor: name, text, choices }) => {
    // TODO: Doesn't yet deal with multiple literals
    const modified = stringVars.length
      ? text.replace(/\[(.+?)\]/g, "{"+stringVars[0]+"}")
      : text.replace(/\[(.+?)\]/g, "{"+stringVars[0]+"}");
    dialogue.callText({ name, text: modified, choices });
  };

  const onInteractionPushed = onPush("e", () => {
    if (dialogue.isBusy()) return;

    const { mode, ...rest } = !conversationController.isRunning()
      ? conversationController.start(startId, {
          startId
        })
      : conversationController.goToNext();

    if (mode === MODES.NEXTNODE) {
      onDisplayText(rest);
    }

    isComplete = mode === MODES.JUSTFINISHED || mode === MODES.COMPLETED;
  });

  dialogue.mount({
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
    id: "conversation",
    isComplete: () => isComplete,
    enter: props => onEntry(),
    update: () => onInteractionPushed(),
    exit: () => onExit()
  };
};
