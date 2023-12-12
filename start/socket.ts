import UdpListener from "App/Sockets/UdpListener";
import Websocket from "App/Sockets/Websocket";
//import {Socket} from "socket.io";

UdpListener.boot();
Websocket.boot();

Websocket.io.on('connection', (/*socket: Socket*/) => {
  //
});
