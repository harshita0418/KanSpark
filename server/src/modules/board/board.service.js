const Board = require("./board.model");

const createBoard = async (title, description, userId) => {
  const board = await Board.create({
    title,
    description: description || '',
    createdBy: userId,
    members: [{ userId, role: 'owner' }]
  });
  return board;
};

const getAllBoards = async (userId) => {
  const boards = await Board.find({
    $or: [
      { createdBy: userId },
      { 'members.userId': userId }
    ]
  })
  .populate('members.userId', 'name lastname email')
  .populate('createdBy', 'name lastname email')
  .sort({ createdAt: -1 });

  return boards;
};

const getBoardById = async (boardId, userId) => {
  const board = await Board.findOne({
    _id: boardId,
    $or: [
      { createdBy: userId },
      { 'members.userId': userId }
    ]
  }).populate('members.userId', 'name lastname email');

  return board;
};

const deleteBoard = async (boardId, userId) => {
  const board = await Board.findOneAndDelete({ _id: boardId, createdBy: userId });
  return board;
};

const updateBoard = async (boardId, userId, { title, description }) => {
  let board = await Board.findOneAndUpdate(
    { _id: boardId, createdBy: userId },
    { title, description },
    { returnDocument: 'after' }
  );

  if (board) return board;

  const boardWithMember = await Board.findOne({
    _id: boardId,
    'members.userId': userId,
    'members.role': { $in: ['owner', 'editor'] }
  });

  if (boardWithMember) {
    board = await Board.findOneAndUpdate(
      { _id: boardId },
      { title, description },
      { returnDocument: 'after' }
    );
  }

  return board;
};



module.exports = {
  createBoard,
  getAllBoards,
  getBoardById,
  deleteBoard,
  updateBoard,

};