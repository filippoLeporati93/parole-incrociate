import {io, Socket} from 'socket.io-client';
import {DefaultEventsMap} from 'socket.io-client/build/typed-events';

import Config from 'react-native-config';

const API_TOKEN = Config.API_TOKEN;

class SocketService {
  public socket: Socket | null = null;

  public connect(
    url: string
  ): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
    return new Promise((rs, rj) => {
      //if connected
      if (this.socket && this.socket.connected) {
        return rs(this.socket as Socket);
      }

      // if disconnected, reopen the connection
      if (this.socket && this.socket.disconnected) {
        this.socket.connect();
      }

      // if socket does not exist create and connect, if exists do not create a new connection
      if (!this.socket) {
        this.socket = io(url, {
          auth: {
            token: API_TOKEN,
          },
        });
      }

      if (!this.socket) {
        return rj();
      }

      this.socket.on('connect', () => {
        rs(this.socket as Socket);
      });

      this.socket.on('connect_error', err => {
        console.log('Connection error: ', err);
        rj(err);
      });
    });
  }

  public disconnect(): Promise<void> {
    return new Promise((rs, rj) => {
      if (this.socket && this.socket.connected) {
        try {
          this.socket.disconnect();
          return rs();
        } catch (e) {
          return rj(e);
        }
      }

      return rs();
    });
  }
}

export default new SocketService();
