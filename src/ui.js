import { h, render } from "preact";
import { useEffect, useState } from "preact/compat";
import { on, EV_CONVOSTART, EV_CONVONEXT } from "./events";

const typeWriter = ({
  text,
  speed = 100,
  onNext = () => { },
  onComplete = () => { }
}) => {
  const nextText = (i = 0, str = "") => {
    if (i < text.length) {
      str = str + text.charAt(i);
      i++;
      onNext(str);
      setTimeout(() => {
        nextText(i, str);
      }, speed);
    } else {
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
  children,
  onTextStarted = () => { },
  onTextComplete = () => { }
}) => {
  const [textStep, setTextStep] = useState("");

  useEffect(() => {
    onTextStarted();

    typeWriter({
      speed: 50,
      text,
      onNext: text => setTextStep(text),
      onComplete: () => onTextComplete()
    }).start();
  }, []);

  return (
    <div class="dialogueBoxOuter">
      <div class="dialogue">
        <p>
          {title}:
        </p>
        <p>
          {textStep}
        </p>
        <div class="arrow" />
        <div class="children">
          {children}
        </div>
      </div>
    </div>
  );
};

const ChoiceWindow = ({ choices = [], onChoiceSelected = () => { } }) => {
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

const Shell = ({ onConversationChoice = () => { } }) => {
  const [debugData] = useState({});
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [currentChoices, setCurrentChoices] = useState(null);
  const [canProceed, setCanProceed] = useState(true);

  const onConvoStarted = data => {
    if (!canProceed) return;

    console.log("Conversation started:");
    console.log(data.conversationProps);

    setCanProceed(false);

    setCurrentDialogue({
      title: data.actorProps.name,
      text: data.conversationProps.actor
        ? `"${data.conversationProps.text}"`
        : data.conversationProps.text
    });

    setCurrentChoices(data.conversationProps.choices);
  };

  const onConvoNext = data => {
    if (canProceed && !currentChoices) {
      console.log("Conversation next:");
      setCurrentDialogue(data);
    }
  };

  const onChoiceSelected = choice => {
    console.log(choice);
    setCurrentChoices(null);
    onConversationChoice(choice);
  };

  const onTextStarted = () => setCanProceed(false);

  const onTextComplete = () => setCanProceed(true);

  useEffect(() => {
    on(EV_CONVOSTART, onConvoStarted);
    on(EV_CONVONEXT, onConvoNext);
  }, []);

  return (
    <div class="uiShell">
      {debugData && <DebugWindow {...debugData} />}
      {currentDialogue &&
        <DialogueBox
          {...currentDialogue}
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
