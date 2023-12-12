import Logger from "@ioc:Adonis/Core/Logger";
import DataPacketService from "App/Services/DataPacketService";
import {Buffer} from "memfs/lib/internal/buffer";
const dgram = require('node:dgram');

type RemoteAddressInformation = {
  address: string,
  port: number,
  size: number
  family: 'IPv4' | 'IPv6',
};

class UdpListener {

  public address: string = '0.0.0.0';
  public port: number = 12_000;

  public socket;
  private booted = false;

  private lastPacketAtTime = 0;
  // @ts-ignore
  private count = 0;

  public boot() {
    /** Ignore multiple calls to the boot method */
    if (this.booted) {
      return;
    }

    this.booted = true;
    Logger.info('UDP Listener Booted.');

    this.start();
    Logger.info(`UDP Listener Started on ${this.address}:${this.port}.`);
  }

  private start(): void {
    this.socket = dgram.createSocket('udp4');
    this.socket.on('message', this.handleMessage);
    this.socket.bind({
      address: this.address,
      port: this.port
    });
  }

  private handleMessage(message: Buffer, _rinfo: RemoteAddressInformation): void {
    this.count++;
    const current_time = new Date().getTime();
    if (current_time <= this.lastPacketAtTime + 100) {
      return;
    }

    this.lastPacketAtTime = current_time;
    DataPacketService.parseDataPacket(message);
    this.count = 0;
  }
}

export default new UdpListener();
