const Board = require("../board/board.model");

// Check if the logged-in user is a member of the board or owner
const isBoardMember = async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const userId = req.user.id;

    // Check if user is the board owner
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ success: false, message: "Board not found" });
    }

    if (board.createdBy.toString() === userId) {
      req.memberRole = 'owner';
      return next();
    }

    // Check if user is a member
    const member = board.members.find(m => m.userId.toString() === userId);
    if (!member) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. You are not a member of this board" });
    }

    req.memberRole = member.role;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check if the logged-in user is the owner of the board
const isBoardOwner = async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const userId = req.user.id;

    // Check if user is the board owner
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ success: false, message: "Board not found" });
    }

    if (board.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Only the board owner can perform this action" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { isBoardMember, isBoardOwner };
