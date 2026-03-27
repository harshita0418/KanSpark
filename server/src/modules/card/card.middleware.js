const BoardMember = require("../member/member.model");
const Card = require("./card.model");

// Only editors and owners can create, update, delete, move cards
const canEditCard = async (req, res, next) => {
  try {
    const boardId = req.params.boardId || req.body.boardId;
    const userId = req.user.userId;

    const member = await BoardMember.findOne({ boardId, userId });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a member of this board",
      });
    }

    if (member.role === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Viewers cannot modify cards",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check card belongs to the board
const cardBelongsToBoard = async (req, res, next) => {
  try {
    const { cardId, boardId } = req.params;

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    if (card.boardId.toString() !== boardId) {
      return res.status(403).json({
        success: false,
        message: "Card does not belong to this board",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { canEditCard, cardBelongsToBoard };
