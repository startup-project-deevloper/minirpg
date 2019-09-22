import { h, render } from "preact";
import { useEffect, useState } from "preact/compat";
import { on, EV_CONVOSTART, EV_CONVONEXT, EV_CONVOEND } from "./events";

const TypeWriter = ({ text, onTextStarted = () => {}, onTextComplete = () => {} }) => {

  const [str, setString] = useState('')

  const t = (s, i) => {

    if (i > text.length) {
      onTextComplete();
      return;
    };
    
    const nextString = s + text.charAt(i);
    setString(nextString)

    i += 1;

    setTimeout(() => {
      t(nextString, i)
    }, 50)
  }

  useEffect(() => {
    onTextStarted();
    t('', 0);
  }, [text])

  return <span>{str}</span>
}

const DialogueBox = ({
  title,
  text,
  canProceed = false,
  children,
  onTextStarted = () => {},
  onTextComplete = () => {}
}) => {
  return (
    <div class="dialogueBoxOuter">
      <div class="dialogue">
        <p>
          {title}:
        </p>
        <TypeWriter text={text} onTextStarted={onTextStarted} onTextComplete={onTextComplete} />
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
    console.log("Next call:", canProceed)
    if (canProceed && currentChoices.length === 0) {
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
    setCurrentDialogue(null);
    setCurrentChoices([]);
  };

  const onChoiceSelected = choice => {
    setCurrentChoices([]);
    onConversationChoice(choice);
  };

  // TODO: This runs in to trouble as different callbacks start to overlap, it needs to be more linear.
  const onTextComplete = () => {
    console.log('Text complete')
    //setCanProceed(true);
  }

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
          {...currentDialogue}
          canProceed={canProceed}
          onTextComplete={onTextComplete}
        >
          {currentChoices &&
            canProceed &&
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
