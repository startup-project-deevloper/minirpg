import m from "mithril";
import {
  on,
  EV_CONVOSTART,
  EV_CONVONEXT,
  EV_CONVOEND,
  EV_DEBUGLOG
} from "../common/events";

const typeWriter = ({ text, onStart = () => { }, onTyped = str => { }, onFinished = () => { } }) => {
  let animId = "";
  let str = "";

  onStart();

  const t = (s = "", i = 0) => {
    if (i > text.length) {
      cancelAnimationFrame(animId);
      onFinished();
      return;
    }

    str = s + text.charAt(i);

    i += 1;
    onTyped(str);

    requestAnimationFrame(() => t(str, i));
  };

  return {
    start: () => (animId = requestAnimationFrame(() => t()))
  };
};

const Shell = ({ attrs }) => {
  let debugText = [];
  let isTyping = false;
  let name = "";
  let text = "";
  let choices = [];
  let actors = [];

  const onConvoStart = ({ startId, currentActors }) => {
    /* Avoid multiple calls here, causes problems */
    console.log("Convo start even triggered.");
    console.log(isTyping, startId, currentActors)
    if (isTyping) return;

    actors = currentActors;

    const props = attrs.conversationManager.start(startId);
    if (!props) return;

    const actorName = props.actor
      ? actors.find(x => props.actor === x.id).name
      : null;

    name = actorName;
    text = "";
    choices = [];

    // Apparently this needs to be forced (will double check)
    m.redraw();

    // Start typewriter effect
    typeWriter({
      text: props.text,
      onStart: () => isTyping = true,
      onTyped: str => {
        text = str;
        m.redraw();
      },
      onFinished: () => {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];
        m.redraw();
      }
    }).start();
  };

  const callChoices = (props) => {
    // ?
  }

  const callText = (props) => {

    if (isTyping) return;

    name = props.actor;
    text = "";
    choices = [];

    // Apparently this needs to be forced (will double check)
    m.redraw();

    // Start typewriter effect
    typeWriter({
      text: props.text,
      onStart: () => isTyping = true,
      onTyped: str => {
        text = str;
        m.redraw();
      },
      onFinished: () => {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];
        m.redraw();
      }
    }).start();
  };

  const onChoiceSelected = choice => {
    if (isTyping) return;

    const props = attrs.conversationManager.goToExact(choice.to);
    if (!props) return;

    const actorName = props.actor
      ? actors.find(x => props.actor === x.id).name
      : null;
    name = actorName;
    text = "";
    choices = [];

    // Apparently this needs to be forced (will double check)
    m.redraw();

    // Start typewriter effect
    typeWriter({
      text: props.text,
      onStart: () => isTyping = true,
      onTyped: str => {
        text = str;
        m.redraw();
      },
      onFinished: () => {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];
        m.redraw();
      }
    }).start();
  };

  const onConvoEnd = () => {
    isTyping = false;
    name = "";
    text = "";
    choices = [];
    actors = [];
    m.redraw();
  };

  const onDebugLog = (output, clearPrevious = false, maxLines = 4) => {

    debugText = clearPrevious ? [output] : [...debugText, output];

    if (debugText.length > maxLines) {
      debugText.splice(0, 1);
    }

    m.redraw();
  };

  return {
    callText,
    callChoices,
    oninit: () => {
      console.log("UI initialized.");
      //on(EV_CONVOSTART, onConvoStart);
      //on(EV_CONVONEXT, callText);
      //on(EV_CONVOEND, onConvoEnd);
      //on(EV_DEBUGLOG, onDebugLog);
    },
    view: () => {
      return m("div", { class: "uiShell" }, [
        text &&
        m("div", { class: "dialogueBoxOuter" }, [
          m("div", { class: "dialogue" }, [
            m("span", name ? `${name}:` : ""),
            m("span", name ? `"${text}"` : text),
            m(
              "div",
              { class: "choiceWindow" },
              choices.map(choice => {
                return m(
                  "button",
                  {
                    class: "choiceBox",
                    onclick: () => onChoiceSelected(choice)
                  },
                  choice.text
                );
              })
            ),
            isTyping ? "" : m("span", { class: "arrow" })
          ])
        ]),
        m("div", { class: "debugWindow" }, [
          debugText.map(s => {
            return m("span", s);
          }),
          m("span", { class: "cursor4" }, "_")
        ])
      ]);
    }
  };
};

const inst = (
  props = {}
) => {

  // Need to expose functions here from above somehow
  const v = m(Shell, props)

  console.log(v)

  return {
    start: () =>
      m.mount(document.getElementById("ui"), {
        view: v
      })
  };
};

export default {
  ...inst()
};
