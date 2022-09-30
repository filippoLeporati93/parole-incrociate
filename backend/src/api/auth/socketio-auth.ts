'use strict';

import { Namespace, Server, Socket } from "socket.io";

var debug = require('debug')('socketio-auth');

type socketIOAuthConfig = {
  timeout?: number,
  authenticate: (socket: Socket, callback: (error: Error, success: boolean) => void) => void,
  postAuthenticate?: (socket: Socket) => void,
  disconnect?: (socker: Socket) => void,
}

const noop = () => { };

const useSocketIOAuth = (io: Server, config: socketIOAuthConfig) => {
  config = config || {
    timeout: 1000,
    authenticate: noop,
    postAuthenticate: noop,
    disconnect: noop,
  };

  var timeout = config.timeout || 1000;
  var postAuthenticate = config.postAuthenticate || noop;
  var disconnect = config.disconnect || noop;

  io._nsps.forEach(nsp => forbidConnections(nsp));
  io.on('connection', (socket) => {

    socket.data.auth = false;
    socket.on('authentication', () => {
      config.authenticate(socket, (err, success) => {
        if (success) {
          debug('Authenticated socket %s', socket.id);
          socket.data.auth = true;

          io._nsps.forEach(nsp => restoreConnection(nsp, socket));

          socket.emit('authenticated', success);
          return postAuthenticate(socket);
        } else if (err) {
          debug('Authentication error socket %s: %s', socket.id, err.message);
          socket.emit('unauthorized', { message: err.message }, function () {
            socket.disconnect();
          });
        } else {
          debug('Authentication failure socket %s', socket.id);
          socket.emit('unauthorized', { message: 'Authentication failure' }, function () {
            socket.disconnect();
          });
        }

      });

    });

    socket.on('disconnect', function () {
      return disconnect(socket);
    });

    if (timeout) {
      setTimeout(function () {
        // If the socket didn't authenticate after connection, disconnect it
        if (!socket.data.auth) {
          debug('Disconnecting socket %s', socket.id);
          socket.disconnect();
        }
      }, timeout);
    }

  });
};

/**
 * Set a listener so connections from unauthenticated sockets are not
 * considered when emitting to the namespace. The connections will be
 * restored after authentication succeeds.
 */
function forbidConnections(nsp: Namespace) {
  nsp.on('connect', function (socket) {
    if (!socket.data.auth) {
      debug('removing socket from %s', nsp.name);
      nsp.sockets.delete(socket.id);
    }
  });
}

/**
 * If the socket attempted a connection before authentication, restore it.
 */
function restoreConnection(nsp: Namespace, socket: Socket) {
  if (nsp.sockets.has(socket.id)) {
    debug('restoring socket to %s', nsp.name);
    nsp.sockets.set(socket.id, socket);
  }
}

export default useSocketIOAuth;