const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const Board = require("../modules/board/board.model");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const toRoomUserId = (userId) => `user:${String(userId)}`;
const toRoomBoardId = (boardId) => `board:${String(boardId)}`;

const collectUserIds = (board, extraUserIds = []) => {
  const ids = new Set();

  if (board?.createdBy) {
    ids.add(String(board.createdBy));
  }

  for (const member of board?.members || []) {
    if (member?.userId) {
      ids.add(String(member.userId));
    }
  }

  for (const userId of extraUserIds) {
    if (userId) {
      ids.add(String(userId));
    }
  }

  return [...ids];
};

const setupSocketServer = (httpServer, app) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const authToken = socket.handshake.auth?.token;
    const headerToken = socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, "");
    const token = authToken || headerToken;

    if (!token) {
      return next();
    }

    try {
      socket.user = jwt.verify(token, JWT_SECRET);
      return next();
    } catch (error) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.user?.id) {
      socket.join(toRoomUserId(socket.user.id));
    }

    socket.on("board:join", (boardId) => {
      if (boardId) {
        socket.join(toRoomBoardId(boardId));
      }
    });

    socket.on("board:leave", (boardId) => {
      if (boardId) {
        socket.leave(toRoomBoardId(boardId));
      }
    });
  });

  app.set("io", io);

  return io;
};

const emitBoardsChanged = async (io, boardId, extraUserIds = []) => {
  if (!io || !boardId) {
    return;
  }

  const board = await Board.findById(boardId).select("createdBy members.userId");
  const userIds = collectUserIds(board, extraUserIds);
  const payload = { boardId: String(boardId), timestamp: Date.now() };

  for (const userId of userIds) {
    io.to(toRoomUserId(userId)).emit("boards:changed", payload);
  }

  io.to(toRoomBoardId(boardId)).emit("board:changed", payload);
};

const emitBoardDeleted = (io, board, extraUserIds = []) => {
  if (!io || !board?._id) {
    return;
  }

  const boardId = String(board._id);
  const userIds = collectUserIds(board, extraUserIds);
  const payload = { boardId, deleted: true, timestamp: Date.now() };

  for (const userId of userIds) {
    io.to(toRoomUserId(userId)).emit("boards:changed", payload);
  }

  io.to(toRoomBoardId(boardId)).emit("board:changed", payload);
};

module.exports = {
  setupSocketServer,
  emitBoardsChanged,
  emitBoardDeleted,
  toRoomBoardId,
  toRoomUserId,
};
