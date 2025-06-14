import express from "express"
import { createServer } from "http"
import { Server as WS } from "socket.io"
import { v4 } from "uuid"

let users = {}

const app = express();
const server = createServer(app);
const io = new WS(server, {
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  }
})


app.get('/hello', (_req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.get("/users", (_req, res) => {
  res.send(JSON.stringify(users, true))
})

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let user = {
    id, username: `New User ${id}`, 
  }
  if (socket.handshake.auth.id in Object.keys(users)) {
    // re-connection
  } else if (socket.handshake.auth.id) {
    users[id] = user
  } else {
    const id = v4();
    socket.emit("you-are", id);
    users[id] = user
  }

  console.log(`id ${id} connected`);
  io.emit("user-joined", users[id]);

  socket.on("disconnect", () => {
    console.log(`id ${id} disconnected`)
    delete users[id]
    socket.broadcast.emit("left", id)
  })
});


io.on("request-player-list", () => {
  io.emit("player-list", users)
})

io.on("rename", (id, username) => {
  if (!users[id]) {
    console.error(`user ${id} does not exist.`)
  }
  users[id].username = username
  io.emit("user-update", users[id])
})


server.listen(3000, () => {
  console.log('listening on *:3000');
});
