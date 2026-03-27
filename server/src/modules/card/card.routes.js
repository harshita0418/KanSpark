const express = require("express");
const router = express.Router({ mergeParams: true });
const { create, update, remove, move } = require("./card.controller");
const { protect } = require("../auth/auth.middleware");
const { canEditCard, cardBelongsToBoard } = require("./card.middleware");

// POST /api/boards/:boardId/cards
router.post("/", protect, canEditCard, create);

// PATCH /api/boards/:boardId/cards/:cardId
router.patch("/:cardId", protect, canEditCard, cardBelongsToBoard, update);

// DELETE /api/boards/:boardId/cards/:cardId
router.delete("/:cardId", protect, canEditCard, cardBelongsToBoard, remove);

// PATCH /api/boards/:boardId/cards/:cardId/move
router.patch("/:cardId/move", protect, canEditCard, cardBelongsToBoard, move);

module.exports = router;
