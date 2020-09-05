import { on as kontraOn, off as kontraOff, emit as kontraEmit } from "kontra";

export const EV_CONVOSTART = "ev.convoStart";
export const EV_CONVOEND = "ev.convoEnd";
export const EV_CONVONEXT = "ev.convoNext";
export const EV_CONVOCHOICE = "ev.convoChoice";
export const EV_SCENECHANGE = "ev.sceneChange";
export const EV_INTERACTION = "ev.onInteraction";
export const EV_UPDATECONVOTRIGGER = "ev.onUpdateConvoTrigger";
export const EV_GIVEQUEST = "ev.onGiveQuest";

let registry = {};

export const on = (e, fn) => {
  registry[e] = fn;
  kontraOn(e, registry[e]);
};

export const off = (e, fn) => kontraOff(e, fn);

export const allOff = (ignoreList = []) =>
  Object.keys(registry).map(
    k => !ignoreList.some(str => str === k) && off(k, registry[k])
  );

export const emit = (e, args = null) => kontraEmit(e, args);
