import { h, render } from "preact";
import { useEffect, useState } from "preact/compat";
import { on, EV_CONVOSTART, EV_CONVONEXT, EV_CONVOEND } from "./events";

const DialogueBox = ({
  title,
  text,
  canProceed = false,
  children
}) => {
  return (
    <div class="dialogueBoxOuter">
      <div class="dialogue">
        <p>
          {title}:
        </p>
        {text}
        {canProceed && <div class="arrow" />}
        <div class="children">
          {children}
        </div>
      </div>
    </div>
  );
};

const ChoiceWindow = ({ choices = [], onChoiceSelected = () => {} }) => {
  return (
    <div class="choiceWindow">
      {choices.map(choice => {
        return (
          <div
            class="choiceBox"
            onClick={() => {
              onChoiceSelected(choice);
            }}
          >
            {choice.text}
          </div>
        );
      })}
    </div>
  );
};

const DebugWindow = ({ ...props }) => {
  return (
    <div class="debugWindow">
      <p>Game Debug:</p>
      <div>...</div>
    </div>
  );
};

const Shell = ({ onConversationChoice = () => {} }) => {
  const [debugData] = useState({});
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [currentChoices, setCurrentChoices] = useState([]);
  const [canProceed, setCanProceed] = useState(true);
  const [typingInProgress, setTypingInProgress] = useState(false)

  const onConvoStarted = ({ node, passedProps = {} }) => {
    const speakingActor = passedProps.currentActors.find(
      actor => actor.id === node.actor
    );

    if (!canProceed) return;

    setCanProceed(false);

    setCurrentDialogue({
      title: speakingActor ? speakingActor.name : "No name set",
      text: node.actor ? `"${node.text}"` : node.text
    });

    setCurrentChoices(node.choices);
  };

  const onConvoNext = ({ node, passedProps = {} }) => {
    // It seems you can proceed way before you're supposed to...
    if (!typingInProgress && currentChoices.length === 0) {
      console.log("Conversation next:", node, passedProps);

      const speakingActor = passedProps.currentActors.find(
        actor => actor.id === node.actor
      );

      setCanProceed(false);

      setCurrentDialogue({
        title: speakingActor ? speakingActor.name : "No name set",
        text: node.actor ? `"${node.text}"` : node.text
      });

      setCurrentChoices(node.choices);
    }
  };

  const onConvoEnd = () => {
    setCanProceed(true);
    setCurrentDialogue(null);
    setCurrentChoices([]);
  };

  const onChoiceSelected = choice => {
    setCurrentChoices([]);
    onConversationChoice(choice);
  };

  const [str, setString] = useState('')
  const t = (s, i = 0) => {

    if (i > currentDialogue.text.length) {
      setTypingInProgress(false);
      return;
    };
    
    const nextString = s + currentDialogue.text.charAt(i);
    setString(nextString)

    i += 1;

    setTimeout(() => {
      t(nextString, i)
    }, 50)
  }

  useEffect(() => {
    if(currentDialogue && !typingInProgress) {
      setTypingInProgress(true);
      t('');
    }
  }, [currentDialogue])

  useEffect(() => {
    // TODO: Make sure these are only binding once! If things do reload, unbind and rebind.
    on(EV_CONVOSTART, onConvoStarted);
    on(EV_CONVONEXT, onConvoNext);
    on(EV_CONVOEND, onConvoEnd);
  }, []);

  return (
    <div class="uiShell">
      {debugData && <DebugWindow {...debugData} />}
      {currentDialogue &&
        <DialogueBox
          title={currentDialogue.title}
          text={str}
          canProceed={canProceed}
        >
          {currentChoices &&
            !typingInProgress &&
            <ChoiceWindow
              choices={currentChoices}
              onChoiceSelected={onChoiceSelected}
            />}
        </DialogueBox>}
    </div>
  );
};

export default props => {
  return {
    start: () => {
      render(<Shell {...props} />, document.getElementById("ui"));
    }
  };
};
