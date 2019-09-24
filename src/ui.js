import m from 'mithril'
import { on, EV_CONVOSTART, EV_CONVONEXT, EV_CONVOEND } from "./events";

const typeWriter = ({
  text,
  onTyped = str => { },
  onFinished = () => { }
}) => {

  let animId = '';
  let str = ''
  const t = (s = '', i = 0) => {

    if (i > text.length) {
      console.log('done')
      cancelAnimationFrame(animId);
      onFinished();
      return;
    };

    str = s + text.charAt(i);
    i += 1;

    onTyped(str);

    requestAnimationFrame(() => t(str, i))
  }

  return {
    start: () => animId = requestAnimationFrame(t)
  }
}

const Shell = ({ attrs }) => {

  let isTyping = false;
  let text = '';
  let choices = [];

  const onConvoNext = props => {
    if (isTyping) return;
    isTyping = true;

    console.log(props);
    text = '';
    choices = [];

    // Apparently this needs to be forced (will double check)
    m.redraw();

    // Start typewriter effect
    typeWriter({
      text: props.node.text,
      onTyped: str => {
        text = str;
        m.redraw();
      },
      onFinished: () => {
        isTyping = false;
        choices = props.node.choices.length ? props.node.choices : [];
        m.redraw();
      }
    }).start()
  }

  const onChoiceSelected = choice => {
    choices = [];
    attrs.onConversationChoice(choice);
  };

  const onConvoEnd = () => {
    text = '';
    choices = [];
    m.redraw();
  }

  return {
    oninit: () => {
      on(EV_CONVOSTART, onConvoNext);
      on(EV_CONVONEXT, onConvoNext);
      on(EV_CONVOEND, onConvoEnd);
    },
    // Remember: Don't make fat components.
    view: () => {
      return m("div", { class: "uiShell" }, [
        m("div", text),
        m("div", choices.map(choice => {
          return m("button", {
            onclick: () => onChoiceSelected(choice)
          }, choice.text)
        }))
      ])
    }
  }
}

export default (props = {
  onConversationChoice: () => { }
}) => {
  return {
    start: () => {
      m.mount(document.getElementById('ui'), {
        view: () => m(Shell, props)
      })
    }
  };
};
