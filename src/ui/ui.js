import m from "mithril";
import { typeWriter } from "./effects";

let mounted = false;
let isTyping = false;
let name = "";
let text = "";
let choices = [];

const primeGlobals = props => {
  name = props.name;
  text = "";
  choices = [];

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
