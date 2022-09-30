import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

import Config from 'react-native-config';

const API_TOKEN = Config.API_TOKEN;

class SocketService {
  public socket: Socket | null = null;

  public connect(
    url: string
  ): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
    return new Promise((rs, rj) => {
      this.socket = io(url, {
        auth: {
          token: API_TOKEN
        }
      });

      if (!this.socket) return rj();

      this.socket.on("connect", () => {
        rs(this.socket as Socket);
      });

      this.socket.on("connect_error", (err) => {
        console.log("Connection error: ", err);
        rj(err);
      });
    });
  }
}



export default new SocketService();