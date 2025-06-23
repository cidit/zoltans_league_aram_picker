import { Server as WS } from "socket.io"
import { v4 } from "uuid"

import { protocol as p, teams, mergeDeep } from "./sharestate.common.js"

export function apply(httpServer) {

    let io = new WS(httpServer)

    let state = {
        connections: {}
    }

    io.on(`connection`, socket => {
        let id = socket.handshake.auth.id || v4();
        socket.emit(p.server.YOU_ARE, id);

        if (!state.connections[id]) {
            const numConnections = Object.keys(state.connections).length()
            let team = numConnections % 2 == 0 ? teams.BLUE : teams.RED
            
            state.connections[id] = {
                username: `New User ${id}`,
                team,
                join: Date.now()
            };

            console.log(`id ${id} connected`);
            io.emit(p.server.STATE, state)
        }

        socket.on(p.client.UPDATE, changes => {
            mergeDeep(state, changes)
            io.emit(p.server.STATE_CHANGE, changes)
        })

        socket.onAny((event, args) => {
            console.log("[", event, "]", JSON.stringify(args, true))
        })

        socket.on("disconnect", () => {
            console.log(`id ${id} disconnected`);
            delete state.connections[id];
            io.emit(p.server.STATE, state)
        });
    })
    return io
}
