import m from "mithril";

let isTyping = false;
let name = "";
let text = "";
let choices = [];

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
  name = props.name;
  text = "";
  choices = [];

  // Apparently this needs to be forced (will double check)
  m.redraw();
}

const callTypewriter = props => typeWriter({
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

const callText = (props) => {

  if (isTyping) return;

  primeGlobals(props);
  callTypewriter(props);
};

const Shell = ({ attrs }) => {
  // I'd start looking at multiple UI components rather than just in here.
  return {
    oninit: () => console.log("UI initialized."),
    view: () => {
      return m("div", { class: "uiShell" }, text &&
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
                    onclick: () => attrs.onChoiceSelected(choice)
                  },
                  choice.text
                );
              })
            ),
            isTyping ? "" : m("span", { class: "arrow" })
          ])
        ]));
    }
  };
};

let mounted = false;

export default {
  isBusy: () => isTyping,
  mount: (attrs = {}) => {
    mounted = true;

    m.mount(document.getElementById("ui"), {
      view: () => m(Shell, attrs)
    })
  },
  unmount: () => {
    mounted = false;
    isTyping = false;
    name = "";
    text = "";
    choices = [];

    m.mount(document.getElementById("ui"), null);
  },
  callText: props => {
    if (!mounted) return;

    callText({
      ...props
    })
  }
};
