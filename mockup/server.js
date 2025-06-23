import express from "express"
import { createServer } from "http"
import { Server as WS } from "socket.io"
import { v4 } from "uuid"
import { protocol as p } from "./sharestate.common.js"
import { apply } from "./sharestate.server.js"


/* workaround start */
// https://stackoverflow.com/questions/64383909/dirname-is-not-defined-error-in-node-js-14-version
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/* workaround end */


const app = express();
const server = createServer(app);
const _io = apply(server)

app.get('/hello', (_req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.get("/users", (_req, res) => {
  res.send(JSON.stringify(users, true))
})

app.use(express.static(__dirname))

server.listen(3000, () => {
  console.log('listening on *:3000');
});
