import m from "mithril";

let GLOBALS = {
  isTyping: false,
  name: "",
  text: "",
  choices: []
}

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

const primeGlobals = props => {
  GLOBALS.name = props.name;
  GLOBALS.text = "";
  GLOBALS.choices = [];

  // Apparently this needs to be forced (will double check)
  m.redraw();
}

const callTypewriter = props => typeWriter({
  text: props.text,
  onStart: () => GLOBALS.isTyping = true,
  onTyped: str => {
    GLOBALS.text = str;
    m.redraw();
  },
  onFinished: () => {
    GLOBALS.isTyping = false;
    GLOBALS.choices = props.choices.length ? props.choices : [];
    m.redraw();
  }
}).start();

const callText = (props) => {

  if (GLOBALS.isTyping) return;

  primeGlobals(props);
  callTypewriter(props);
};

const callChoice = choice => {

  if (GLOBALS.isTyping) return;

  const props = attrs.conversationManager.goToExact(choice.to);

  if (!props) return;

  primeGlobals(props);
  callTypewriter(props);
};

const Shell = ({ attrs }) => {
  // I'd start looking at multiple UI components rather than just in here.
  return {
    oninit: () => console.log("UI initialized."),
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
                    onclick: () => callChoice(choice)
                  },
                  choice.text
                );
              })
            ),
            GLOBALS.isTyping ? "" : m("span", { class: "arrow" })
          ])
        ])
      ]);
    }
  };
};

export const _shellInst = m.mount(document.getElementById("ui"), {
  view: () => m(Shell, {})
})()

export default {
  callText: props => callText({
    ...props
  }),
  reset: () => GLOBALS = {
    isTyping: false,
    name: "",
    text: "",
    choices: []
  }
};
