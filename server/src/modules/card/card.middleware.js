const Board = require("../board/board.model");
const Card = require("./card.model");

const canEditCard = async (req, res, next) => {
  try {
    const cardId = req.params.cardId || req.body.cardId;
    const userId = req.user.id;

    if (cardId) {
      const card = await Card.findById(cardId);
      if (card) {
        const board = await Board.findById(card.boardId);
        if (board) {
          if (board.createdBy.toString() === userId) {
            return next();
          }
          const member = board.members.find(m => m.userId.toString() === userId);
          if (member && member.role !== "viewer") {
            return next();
          }
          if (!member) {
            return res.status(403).json({
              success: false,
              message: "Access denied. You are not a member of this board",
            });
          }
          return res.status(403).json({
            success: false,
            message: "Access denied. Viewers cannot modify cards",
          });
        }
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const cardBelongsToBoard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { canEditCard, cardBelongsToBoard };