import { Server } from "socket.io";
import AdonisServer from '@ioc:Adonis/Core/Server';

class Websocket {
  public io: Server;
  private booted = false;

  public boot() {
    /** Ignore multiple calls to the boot metho */
    if (this.booted) {
      return
    }

    this.booted = true;
    this.io = new Server(AdonisServer.instance, {
      cors: { origin: '*' },
      transports: ['websocket']
    });
  }
}

export default new Websocket();
