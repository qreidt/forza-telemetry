import Websocket from "App/Sockets/Websocket";
import UdpListener from "App/Sockets/UdpListener";
import {Socket} from "socket.io";

Websocket.boot();
UdpListener.boot();

Websocket.io.on('connect_error', function (err) {
  console.log(err);
});

Websocket.io.on('connection', (_socket: Socket) => {
  //
});
