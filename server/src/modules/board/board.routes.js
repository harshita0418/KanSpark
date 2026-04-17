const express = require("express");
const router = express.Router();
const { protect } = require("../auth/auth.middleware");
const {
  createBoard,
  getAllBoards,
  getBoard,
  deleteBoard,
  updateBoard,
  getArchivedBoards,
  restoreBoard,
  permanentDeleteBoard,
} = require("./board.controller");

// All board routes require authentication
router.use(protect);

// POST /api/boards - Create a board
router.post("/", createBoard);

// GET /api/boards - Get all boards for user
router.get("/", getAllBoards);

// GET /api/boards/archived - Get archived boards
router.get("/archived", getArchivedBoards);

// GET /api/boards/:boardId - Get a specific board
router.get("/:boardId", getBoard);

// PUT /api/boards/:boardId - Update a board
router.put("/:boardId", updateBoard);

// DELETE /api/boards/:boardId - Delete a board (soft delete)
router.delete("/:boardId", deleteBoard);

// POST /api/boards/:boardId/restore - Restore archived board
router.post("/:boardId/restore", restoreBoard);

// DELETE /api/boards/:boardId/permanent - Permanently delete board
router.delete("/:boardId/permanent", permanentDeleteBoard);

module.exports = router;