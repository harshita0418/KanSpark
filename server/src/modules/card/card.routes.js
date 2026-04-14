const express = require("express");
const router = express.Router();
const { create, update, remove, move, getByList } = require("./card.controller");
const { protect } = require("../auth/auth.middleware");
const { canEditCard, cardBelongsToBoard } = require("./card.middleware");

router.use(protect);

router.get("/", getByList);
router.post("/", create);
router.patch("/:cardId", cardBelongsToBoard, update);
router.delete("/:cardId", cardBelongsToBoard, remove);
router.patch("/:cardId/move", canEditCard, cardBelongsToBoard, move);

module.exports = router;