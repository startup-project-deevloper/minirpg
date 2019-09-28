export default ({
  conversationData,
  onChatStarted = (node, props) => {},
  onChatNext = (node, props) => {},
  onChatComplete = lastPositionSaved => {},
  onChainProgress = lastNodeId => {}
}) => {
  let index = 0;
  let currentNode = conversationData[index];
  let isRunning = false;
  let isComplete = false;

  const _displayNode = queriedNode => {
    if (queriedNode) {
      currentNode = queriedNode;
      index = queriedNode.index;
      return queriedNode;
    } else {
      throw "No node match.";
    }
  };

  const _queryNode = query => {
    const queriedNode = conversationData.length
      ? conversationData.filter((node, index) => {
          return query === node.id
            ? {
                node,
                index
              }
            : null;
        })[0]
      : null;

    return _displayNode(queriedNode);
  };

  return {
    isComplete: () => isComplete,
    currentIndex: () => index,
    // TODO: Can't we just alias or condense these?
    start: (query, props = {}) => {
      const queriedNode = _queryNode(query);

      index = queriedNode.index;
      currentNode = queriedNode;
      isRunning = true;
      isComplete = false;

      onChatStarted(queriedNode, props);

      return _displayNode(queriedNode);
    },
    goToExact: (query, props = {}) => {
      const queriedNode = _queryNode(query);

      index = queriedNode.index;
      currentNode = queriedNode;

      onChatNext(queriedNode, props);

      return _displayNode(queriedNode);
    },
    goToNext: (props = {}) => {
      // We need to run this 'after' the finish so it avoids chained exec on exit.
      if (!isRunning) return;

      if (isComplete) {
        isRunning = false;

        return;
      }

      // TODO: Beware, if you're not checking for existent choices, this will error out,
      // or do something a little funky. May want to check for choices here instead?
      const { id, to, choices, actions } = currentNode;

      // Wait if choices are presented.
      if (choices.length) return;

      // TODO: Consts please.
      if (
        actions.some(action => action === "endConversation") ||
        (choices.length === 0 && !to)
      ) {
        if (actions.some(action => action === "save")) {
          // ... onSave, etc
          onChainProgress(id);
          console.log("Saved chain position to:", id);
        }
        if (actions.some(action => action === "cancel")) {
          // ... onCancel, etc
          console.log("Cancelled, nothing was saved.");
        }
        isComplete = true;
        onChatComplete(id);
        console.log("End reached, close the convo.");
        return;
      }

      const queriedNode = _queryNode(to);

      index = queriedNode.index;
      currentNode = queriedNode;

      onChatNext(queriedNode, props);

      return _displayNode(queriedNode);
    }
  };
};
