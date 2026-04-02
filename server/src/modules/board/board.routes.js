const express = require("express");
const router = express.Router();
const { protect } = require("../auth/auth.middleware");
const {
  createBoard,
  getAllBoards,
  getBoard,
  deleteBoard,
  updateBoard,
} = require("./board.controller");

// All board routes require authentication
router.use(protect);

// POST /api/boards - Create a board
router.post("/", createBoard);

// GET /api/boards - Get all boards for user
router.get("/", getAllBoards);

// GET /api/boards/:boardId - Get a specific board
router.get("/:boardId", getBoard);

// PUT /api/boards/:boardId - Update a board
router.put("/:boardId", updateBoard);

// DELETE /api/boards/:boardId - Delete a board
router.delete("/:boardId", deleteBoard);

module.exports = router;