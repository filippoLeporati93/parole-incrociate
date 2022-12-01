import {io, Socket} from 'socket.io-client';

import Config from 'react-native-config';
import SocketSessionUtils from '../utils/SocketSessionUtils';
import {socketSession} from '../models/Types';
import StatisticsUtils from '../utils/StatisticsUtils';

const API_TOKEN = Config.API_TOKEN;
const BASE_WS_URL = Config.BASE_WS_URL;

class SocketService {
  public socket: Socket | null = null;
  public userID: string = '';
  public users: socketSession[] = [];

  private mapUser(user: socketSession) {
    return {
      userID: user.userID,
      username: user.username,
      statsInfo: JSON.parse(user.statsInfo),
    };
  }

  public async connect(
    username: string,
    onSessionCallback: (userID: string) => void,
    onUsersCallback: (users: socketSession[]) => void
  ) {
    const session = await SocketSessionUtils.getSocketSession();

    //if connected
    if (this.socket && this.socket.connected) {
      return;
    }

    // if disconnected, reopen the connection
    if (this.socket && this.socket.disconnected) {
      this.socket.auth = {
        token: API_TOKEN,
        username,
        sessionID: session.sessionID,
      };
      this.socket.connect();
    }

    // if socket does not exist create and connect, if exists do not create a new connection
    if (!this.socket) {
      this.socket = io(BASE_WS_URL, {
        auth: {
          token: API_TOKEN,
          username,
          sessionID: session.sessionID,
        },
      });
    }

    if (!this.socket) {
      return;
    }

    this.socket.on('connect_error', err => {
      console.error('Connection error: ', err);
      return;
    });

    this.socket.on('session', async ({sessionID, userID}) => {
      if (this.socket && this.socket.connected) {
        // attach the session ID to the next reconnection attempts
        this.socket.auth = {
          token: API_TOKEN,
          username,
          sessionID: session.sessionID,
        };
        // store it in the localStorage
        await SocketSessionUtils.setSocketSessionID(sessionID);
        await SocketSessionUtils.setSocketSessionUserID(userID);
        onSessionCallback(userID);
      }
    });

    this.socket.on('users', users => {
      this.users = [];
      users.forEach((u: socketSession) => {
        if (!u.self) {
          this.users.push(this.mapUser(u));
        }
      });
      onUsersCallback([...this.users]);
    });
  }

  public userConnected() {
    StatisticsUtils.calcKpis('ALL', -1).then(kpis => {
      if (this.socket) {
        this.socket.emit('user_connected', {statsInfo: JSON.stringify(kpis)});
      }
    });
  }

  public onUserConnected(cb: (users: socketSession[]) => void) {
    if (this.socket) {
      const listener = (user: any) => {
        if (!this.users.some(e => e.userID === user.userID)) {
          this.users.push(this.mapUser(user));
        }
        cb([...this.users]);
      };
      this.socket.on('user_connected', listener);
      return () => this.socket && this.socket.off('user_connected', listener);
    }
    return () => {};
  }

  public onUserDisconnected(cb: (users: socketSession[]) => void) {
    if (this.socket) {
      const listener = (userID: string) => {
        this.users = this.users.filter(u => u.userID !== userID);
        cb([...this.users]);
      };
      this.socket.on('user_disconnected', listener);
      return () => {
        if (this.socket) {
          this.socket.off('user_disconnected', listener);
        }
      };
    }
    return () => {};
  }

  public disconnect(): Promise<void> {
    return new Promise((rs, rj) => {
      if (this.socket && this.socket.connected) {
        try {
          this.socket.disconnect();
          return rs();
        } catch (e) {
          console.error(e);
          return rj(e);
        }
      }

      return rs();
    });
  }
}

export default new SocketService();
