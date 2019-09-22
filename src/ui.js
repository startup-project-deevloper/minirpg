import { h, render } from "preact";
import { useEffect, useState } from "preact/compat";
import { on, EV_CONVOSTART, EV_CONVONEXT, EV_CONVOEND } from "./events";

const typeWriter = ({
  text,
  speed = 100,
  onNext = () => {},
  onComplete = () => {}
}) => {
  let str = "";
  let waiting = false;

  const nextText = (i = 0) => {
    if (waiting) return;

    if (i < text.length) {
      waiting = true;
      str = str + text.charAt(i);
      i++;
      onNext(str);
      setTimeout(() => {
        waiting = false;
        nextText(i, str);
      }, speed);
    } else if (!waiting) {
      onComplete();
    }
  };

  return {
    start: () => nextText()
  };
};

const DialogueBox = ({
  title,
  text,
  canProceed = false,
  children,
  onTextStarted = () => {},
  onTextComplete = () => {}
}) => {
  const [textStep, setTextStep] = useState("");

  useEffect(
    () => {
      onTextStarted();

      typeWriter({
        speed: 200,
        text,
        onNext: text => setTextStep(text),
        onComplete: () => onTextComplete()
      }).start();
    },
    [text]
  );

  return (
    <div class="dialogueBoxOuter">
      <div class="dialogue">
        <p>
          {title}:
        </p>
        <p>
          {textStep}
        </p>
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
    console.log("Next call:")
    if (canProceed && currentChoices.length === 0) {
      console.log("Conversation next:", node, passedProps);

      const speakingActor = passedProps.currentActors.find(
        actor => actor.id === node.actor
      );

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

  const onTextStarted = () => setCanProceed(false);

  // TODO: This runs in to trouble as different callbacks start to overlap, it needs to be more linear.
  const onTextComplete = () => setCanProceed(true);

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
          onTextStarted={onTextStarted}
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
