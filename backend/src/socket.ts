import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";
import { TableClient } from "@azure/data-tables";
import { SocketSessionEntity } from "api/socket_controllers/socketSessionStore";

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

  io.use(async (socket, next) => {

    const token = socket.handshake.auth.token;
    if (token !== process.env.API_TOKEN) {
      return next(new Error('unauthorized'));
    }

    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = await sessionStore.findSession(sessionID);
      if (session) {
        socket.data.sessionID = sessionID;
        socket.data.userID = session.userID;
        socket.data.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.data.sessionID = randomSessionId();
    socket.data.userID = '@'+ username + '_' + randomUserId();
    socket.data.username = username;
    next();
  });

  io.on("connection", async (socket) => {
    // persist session
    sessionStore.saveSession(socket.data.sessionID, {
      userID: socket.data.userID,
      username: socket.data.username,
      connected: true,
    });
  
    // emit session details
    socket.emit("session", {
      sessionID: socket.data.sessionID,
      userID: socket.data.userID,
    });
  
    // join the "userID" room
    socket.join(socket.data.userID);
  
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
        });
      }
    });

    socket.emit("users", users);
  
    // notify users upon disconnection
    socket.on("disconnect", async () => {
      const matchingSockets = await io.in(socket.data.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit("user_disconnected", socket.data.userID);
        // update the connection status of the session
        sessionStore.saveSession(socket.data.sessionID, {
          userID: socket.data.userID,
          username: socket.data.username,
          connected: false,
        });
      }
    });
  });

  useSocketServer(io, { controllers: [__dirname + "/api/socket_controllers/*"] });

  return io;
};
