import { Server } from "socket.io";
import AdonisServer from '@ioc:Adonis/Core/Server';
import Logger from "@ioc:Adonis/Core/Logger";

class Websocket {
  public io: Server;
  private booted = false;

  public boot(): void {
    /** Ignore multiple calls to the boot method */
    if (this.booted) {
      return
    }

    this.booted = true;
    Logger.info('Websocket Booted.');

    this.start();
    Logger.info('Websocket Started.')
  }

  private start(): void {
    this.io = new Server(AdonisServer.instance, {
      cors: { origin: '*' },
      //path: '/ws',
      transports: ['websocket', 'polling']
    });
  }
}

export default new Websocket();
