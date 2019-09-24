import m from 'mithril'
import { on, EV_CONVOSTART, EV_CONVONEXT, EV_CONVOEND } from "./events";
import { useState } from './helpers';

const typeWriter = ({
  text,
  onTyped = str => { },
  onFinished = () => { }
}) => {

  const [animId, setAnimId] = useState('');
  const [str, setStr] = useState('');
  const t = (s = '', i = 0) => {

    if (i > text.length) {
      cancelAnimationFrame(animId());
      onFinished();
      return;
    };

    const nextStr = s + text.charAt(i);
    setStr(nextStr);

    i += 1;
    onTyped(str());

    requestAnimationFrame(() => t(str(), i))
  }

  return {
    start: () => setAnimId(requestAnimationFrame(() => t()))
  }
}

const Shell = ({ attrs }) => {

  const [isTyping, setIsTyping] = useState(false);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [choices, setChoices] = useState([]);

  const onConvoNext = props => {
    if (isTyping()) return;
    setIsTyping(true);

    const actorName = props.node.actor ? props.passedProps.currentActors.find(x => props.node.actor === x.id).name : null;
    setName(actorName);
    setText('');
    setChoices([]);

    // Apparently this needs to be forced (will double check)
    m.redraw();

    // Start typewriter effect
    typeWriter({
      text: props.node.text,
      onTyped: str => {
        setText(str);
        m.redraw();
      },
      onFinished: () => {
        setIsTyping(false);
        setChoices(props.node.choices.length ? props.node.choices : []);
        m.redraw();
      }
    }).start()
  }

  const onChoiceSelected = choice => {
    setChoices([]);
    attrs.onConversationChoice(choice);
  };

  const onConvoEnd = () => {
    setName('');
    setText('');
    setChoices([]);
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
        text() && m("div", { class: 'dialogueBoxOuter' }, [
          m("div", { class: 'dialogue' }, [
            m("span", name() ? `${name()}:` : ''),
            m("span", name() ? `"${text()}"` : text()),
            m("div", { class: 'choiceWindow' }, choices().map(choice => {
              return m("button", {
                class: "choiceBox",
                onclick: () => onChoiceSelected(choice)
              }, choice.text)
            })),
            isTyping() ? '' : m("span", { class: 'arrow' })
          ]),
        ]),
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
