const mongoose = require("mongoose");
const Board = require("../board/board.model");

const getBoardMembers = async (boardId) => {
  const board = await Board.findById(boardId).populate(
    "members.userId",
    "name lastname email"
  );

  if (!board) {
    throw new Error("Board not found");
  }

  return board.members;
};

const addMember = async (boardId, userId, role) => {
  const userIdObj = new mongoose.Types.ObjectId(userId);
  const boardIdObj = new mongoose.Types.ObjectId(boardId);

  const existingMember = await Board.findOne({
    _id: boardIdObj,
    "members.userId": userIdObj,
  });

  if (existingMember) {
    throw new Error("User is already a member of this board.");
  }

  const board = await Board.findByIdAndUpdate(
    boardId,
    { $push: { members: { userId, role } } },
    { returnDocument: 'after' }
  ).populate("members.userId", "name lastname email");

  if (!board) {
    throw new Error("Board not found");
  }

  const newMember = board.members[board.members.length - 1];
  return newMember;
};

const updateMemberRole = async (boardId, userId, role) => {
  const userIdObj = new mongoose.Types.ObjectId(userId);
  const boardIdObj = new mongoose.Types.ObjectId(boardId);

  const board = await Board.findOneAndUpdate(
    {
      _id: boardIdObj,
      "members.userId": userIdObj,
      "members.role": {
        $in: ["viewer", "editor"]
      }
    },
    { $set: { "members.$.role": role } },
    { returnDocument: 'after' }
  ).populate("members.userId", "name lastname email");

  if (!board) {
    throw new Error("Member not found or cannot update owner role");
  }

  const member = board.members.find(
    (m) => m.userId.toString() === userId
  );
  return member;
};

const removeMember = async (boardId, userId) => {
  const userIdObj = new mongoose.Types.ObjectId(userId);
  const boardIdObj = new mongoose.Types.ObjectId(boardId);
  const obj = {
    _id: boardIdObj,
    "members.userId": userIdObj,
    "members.role": {
      $in: ["viewer", "editor"]
    }
  }
  console.log(obj)
  const board = await Board.findOneAndUpdate(
    obj,
    { $pull: { members: { userId: userIdObj } } },
    { returnDocument: 'after' }
  );

  if (!board) {
    throw new Error("Member not found or cannot remove owner");
  }

  return { message: "Member removed successfully" };
};

module.exports = {
  getBoardMembers,
  addMember,
  updateMemberRole,
  removeMember,
}; 87