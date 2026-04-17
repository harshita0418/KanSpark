const jwt = require('jsonwebtoken');
const Board = require('../modules/board/board.model');

const setupSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    socket.on('join-board', async (boardId) => {
      try {
        const board = await Board.findById(boardId);
        if (!board) {
          socket.emit('error', { message: 'Board not found' });
          return;
        }

        const isMember = board.createdBy.toString() === socket.user.id ||
          board.members.some(m => m.userId.toString() === socket.user.id);

        if (!isMember) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(boardId);
        console.log(`User ${socket.user.id} joined board ${boardId}`);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('leave-board', (boardId) => {
      socket.leave(boardId);
      console.log(`User ${socket.user.id} left board ${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
};

const emitBoardUpdate = (io, boardId, event, data) => {
  io.to(boardId).emit(event, data);
};

module.exports = { setupSocketHandlers, emitBoardUpdate };
