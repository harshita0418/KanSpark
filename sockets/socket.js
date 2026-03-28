const { WebSocket, WebSocketServer } = require('ws');

const Board = require('../models/Board');

function createSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Map();

  function broadcastToBoard(boardId, payload) {
    const message = JSON.stringify(payload);

    for (const [client, info] of clients.entries()) {
      if (info.boardId === boardId && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  function broadcastPresence(boardId) {
    const users = [];

    for (const [, info] of clients.entries()) {
      if (info.boardId === boardId) {
        users.push(info.user);
      }
    }

    broadcastToBoard(boardId, { type: 'presence', users });
  }

  wss.on('connection', (ws) => {
    clients.set(ws, { user: 'Guest', boardId: null });

    ws.on('message', (raw) => {
      let message;

      try {
        message = JSON.parse(raw.toString());
      } catch (error) {
        return;
      }

      if (message.type === 'hello') {
        const previous = clients.get(ws);

        clients.set(ws, {
          user: message.user || 'Guest',
          boardId: message.boardId || null,
        });

        if (previous?.boardId && previous.boardId !== message.boardId) {
          broadcastPresence(previous.boardId);
        }

        if (message.boardId) {
          broadcastPresence(message.boardId);
        }

        return;
      }

      if (message.type === 'activity:add' && message.boardId && message.item) {
        Board.addBoardActivity(message.boardId, message.item);
        broadcastToBoard(message.boardId, {
          type: 'activity',
          item: message.item,
        });
        return;
      }

      if (message.type === 'board:update' && message.boardId && message.columns) {
        Board.updateBoardColumns(message.boardId, message.columns);
        broadcastToBoard(message.boardId, {
          type: 'board',
          boardId: message.boardId,
          columns: message.columns,
        });
      }
    });

    ws.on('close', () => {
      const info = clients.get(ws);
      clients.delete(ws);

      if (info?.boardId) {
        broadcastPresence(info.boardId);
      }
    });
  });

  return {
    wss,
    broadcastPresence,
    broadcastToBoard,
  };
}

module.exports = {
  createSocketServer,
};
