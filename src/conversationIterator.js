import { useState } from "./helpers";

export default ({
  collection,
  onChatNext = node => { },
  onChatComplete = lastPositionSaved => { },
  onChainProgress = lastNodeId => { }
}) => {
  const [index, setIndex] = useState(0);
  const [currentNode, setCurrentNode] = useState(collection[index()]);

  const _displayNode = queriedNode => {
    if (queriedNode) {
      setCurrentNode(queriedNode);
      setIndex(queriedNode.index);
      return queriedNode;
    } else {
      throw "No node match.";
    }
  };

  const _queryNode = query => {
    const queriedNode = collection.length
      ? collection.filter((node, index) => {
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
    currentIndex: () => index(),
    goToExact: query => {
      const queriedNode = _queryNode(query);

      setIndex(queriedNode.index);
      setCurrentNode(queriedNode);

      return _displayNode(queriedNode);
    },
    goToChoice: (query, props = {}) => {
      const queriedNode = _queryNode(query);

      setIndex(queriedNode.index);
      setCurrentNode(queriedNode);

      onChatNext(queriedNode, props);

      return _displayNode(queriedNode);
    },
    goToNext: (props = {}) => {
      // TODO: Beware, if you're not checking for existent choices, this will error out,
      // or do something a little funky. May want to check for choices here instead?
      const { id, to, choices, actions } = currentNode();

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
        onChatComplete(id);
        console.log("End reached, close the convo.");
        return;
      }

      const queriedNode = _queryNode(to);

      setIndex(queriedNode.index);
      setCurrentNode(queriedNode);

      onChatNext(queriedNode, props);

      return _displayNode(queriedNode);
    }
  };
};
