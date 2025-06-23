import { io } from "socket.io-client";


const socket = io({
    auth: { id: localStorage.getItem("user-id") }
});

document.socket = socket

let players = {}
const playersWatcher = new EventTarget();

playersWatcher.addEventListener("list-update", () => {
    
    const blueTeam = $('#blue-team');
    const redTeam = $('#red-team');
    const startBtn = $('#start-btn');
    blueTeam.empty()
    redTeam.empty()

    for (let [id, v] of Object.entries(players)) {
        
        let name = v.username += "👑" // TODO: everyone is the admin!
        let child = `
            <div class="p-2 bg-white rounded shadow h-10 flex items-center justify-center hover:shadow-md transition">${name}</div>`

        if (v.team === "red") {
            redTeam.append(child)
        } else if (v.team === "blue") {
            blueTeam.append(child)
        } else {
            console.error(`invalid team for id ${id}`, v.team)
        }
    }
})

socket.on("connect", () => {
    console.info(`client connected!`, socket.id)
    socket.emit(c.REQ_PLAYER_LIST)

    const modal = document.getElementById('name-modal');
    modal.classList.remove('hidden');
    document.getElementById('name-input').focus();
})


socket.on(c.YOU_ARE, id => {
    localStorage.setItem("user-id", id);
});

socket.on(c.USER_JOINED, user => {
    socket.emit(c.REQ_PLAYER_LIST)
    // if (!players.find(p => p.id === user.id)) {
    //     players.push(user);
    //     updateLobby(true);
    // }
});


socket.on(c.RECV_PLAYER_LIST, list => {
    players = list
    playersWatcher.dispatchEvent(new Event("list-update"))
});


socket.on(c.USER_UPDATE, () => {
    socket.emit(c.REQ_PLAYER_LIST)
});


window.handleNameSubmit = function() {
    console.info("name submit")
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    if (!name) {
        alert("Please enter a name.");
        return;
    }
    document.getElementById('name-modal').classList.add('hidden');
    socket.emit(c.ACTION_USER_RENAME, name)
}


socket.onAny((eventType, ...args) => {
    console.log(`received event '${eventType}' with the following`, args)
})

socket.on(c.REQ_PLAYER_LIST, (playerList) => {
    console.log("new player list", playerList)
})

console.info("hello, world!")