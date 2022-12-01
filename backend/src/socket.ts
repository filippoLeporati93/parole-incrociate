import { useSocketServer } from "socket-controllers";
import { Server, Socket } from "socket.io";
import { TableClient } from "@azure/data-tables";
import { SocketSessionEntity } from "api/socket_controllers/socketSessionStore";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface ISocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  sessionID: string;
  username: string;
  userID: string;
}

const cosmosdb_connstring = process.env.COSMOSDBTABLE_CONNECTIONSTRING ?? "UseDevelopmentStorage=true";
const clientAzureTableSession = TableClient.fromConnectionString(
  cosmosdb_connstring,
  'SocketSession');

const crypto = require("crypto");
const randomSessionId = () => crypto.randomBytes(8).toString("hex");
const randomUserId = () => crypto.randomBytes(2).toString("hex");

const { AzureTableSocketSessionStore } = require("./api/socket_controllers/socketSessionStore");
const sessionStore = new AzureTableSocketSessionStore(clientAzureTableSession);

export default (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (s, next) => {

    const socket = s as ISocket;

    const token = socket.handshake.auth.token;
    if (token !== process.env.API_TOKEN) {
      return next(new Error('unauthorized'));
    }

    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = await sessionStore.findSession(sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.sessionID = randomSessionId();
    socket.userID = '@'+ username + '_' + randomUserId();
    socket.username = username;
    next();
  });

  io.on("connection", async (s) => {

    const socket = s as ISocket;
    // persist session
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });
  
    // emit session details
    socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
    });
  
    // join the "userID" room
    socket.join(socket.userID);
  
    // fetch existing users
    const users: SocketSessionEntity[] = [];
    const sessions = await sessionStore.findAllSessions();
  
    sessions.forEach((session: SocketSessionEntity) => {
      if(session.connected) {
        users.push({
          userID: session.userID,
          username: session.username,
          connected: session.connected,
          statsInfo: session.statsInfo,
          self: socket.userID === session.userID
        });
      }
    });

    socket.emit("users", users);

    //on user connect
    socket.on("user_connected", async ({statsInfo}) => {
      sessionStore.saveSession(
        socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          statsInfo: statsInfo,
        }
      );
      // notify existing users
      socket.broadcast.emit("user_connected", {
        userID: socket.userID,
        username: socket.username,
        connected: true,
        statsInfo: statsInfo,
      });
    });
  
    // notify users upon disconnection
    socket.on("disconnect", async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit("user_disconnected", socket.userID);
        // update the connection status of the session
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          connected: false,
        });
      }
    });
  });

  useSocketServer(io, { controllers: [__dirname + "/api/socket_controllers/*"] });

  return io;
};
