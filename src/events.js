// https://github.com/ai/nanoevents
import NanoEvents from 'nanoevents'
const emitter = new NanoEvents()

export const EV_CONVOSTART = 'ev.convoStart'
export const EV_CONVOEND = 'ev.convoEnd'
export const EV_CONVONEXT = 'ev.convoNext'
export const EV_CONVOCHOICE = 'ev.convoChoice'

export const EVENTS = [
    EV_CONVOSTART,
    EV_CONVOEND,
    EV_CONVONEXT,
    EV_CONVOCHOICE
]

const hasEvent = e => EVENTS.some(s => s === e)

export const on = (e, fn) => hasEvent(e) && emitter.on(e, fn)

export const emit = (e, args = null) => hasEvent(e) && emitter.emit(e, args)