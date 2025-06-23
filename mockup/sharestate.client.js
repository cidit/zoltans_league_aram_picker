import { io } from "socket.io-client";
import { mergeDeep, protocol as p, teams } from "./sharestate.common.js"

class Sharestate extends EventTarget {
    constructor() {
        this.state = {}
        // TODO: could be dependency injected, somehow?
        this.socket = io({
            auth: { id: localStorage.getItem("user-id") }
        });
        this.__setupListeners(this.socket)
    }

    __setupListeners(socket) {
        socket.on(p.server.YOU_ARE, (id) => {
            localStorage.setItem("user-id", id)
        })
        
        socket.onAny((event, body) => {
            console.log(`[`, event, `]`, body)
        })
        
        socket.on(p.server.STATE, state => {
            this.state = state
            this.dispatchEvent(new Event("re-render"))
        })
        
        socket.on(p.server.STATE_CHANGE, (changes) => {
            state = mergeDeep(state, changes)
            // notify listeners
            this.dispatchEvent(new Event("re-render"))
        })
    }
}