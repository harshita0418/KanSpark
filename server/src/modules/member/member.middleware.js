const BoardMember = require("./member.model");

// Check if the logged-in user is a member of the board
const isBoardMember = async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const userId = req.user.userId;

    const member = await BoardMember.findOne({ boardId, userId });

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
    const userId = req.user.userId;

    const member = await BoardMember.findOne({ boardId, userId });

    if (!member || member.role !== "owner") {
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
