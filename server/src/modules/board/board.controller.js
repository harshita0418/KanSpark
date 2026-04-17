const boardService = require("./board.service");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const createBoard = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  const board = await boardService.createBoard(title, description, userId);
  res.status(201).json(board);
});

const getAllBoards = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const boards = await boardService.getAllBoards(userId);
  res.status(200).json(boards);
});

const getBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;
  const board = await boardService.getBoardById(boardId, userId);
  
  if (!board) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  
  res.status(200).json(board);
});

const deleteBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;
  const board = await boardService.deleteBoard(boardId, userId);
  
  if (!board) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  
  res.status(200).json({ message: "Board deleted" });
});

const updateBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;
  const board = await boardService.updateBoard(boardId, userId, { title, description });
  
  if (!board) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  
  res.status(200).json(board);
});

const getArchivedBoards = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const boards = await boardService.getArchivedBoards(userId);
  res.status(200).json(boards);
});

const restoreBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;
  const board = await boardService.restoreBoard(boardId, userId);
  
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  
  res.status(200).json(board);
});

const permanentDeleteBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;
  await boardService.permanentDeleteBoard(boardId, userId);
  
  res.status(200).json({ message: "Board permanently deleted" });
});

module.exports = {
  createBoard,
  getAllBoards,
  getBoard,
  deleteBoard,
  updateBoard,
  getArchivedBoards,
  restoreBoard,
  permanentDeleteBoard,
};