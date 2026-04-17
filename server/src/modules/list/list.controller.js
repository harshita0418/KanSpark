const listService = require('./list.service');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const createList = asyncHandler(async (req, res) => {
  const { title, boardId, color } = req.body;
  
  if (!title || !boardId) {
    return res.status(400).json({ success: false, message: 'title and boardId are required' });
  }
  
  const list = await listService.createList({ title, boardId, color });
  
  const io = req.app.get('io');
  if (io) {
    io.to(boardId).emit('board-update', { type: 'list-created', list });
  }
  
  res.status(201).json(list);
});

const getLists = asyncHandler(async (req, res) => {
  const { boardId } = req.query;
  
  if (!boardId) {
    return res.status(400).json({ success: false, message: 'boardId is required' });
  }
  
  const lists = await listService.getListsByBoard(boardId);
  res.status(200).json(lists);
});

const updateList = asyncHandler(async (req, res) => {
  const { listId } = req.params;
  const { title, position } = req.body;
  
  const list = await listService.updateList({ listId, title, position });
  
  const io = req.app.get('io');
  if (io && list.boardId) {
    io.to(list.boardId).emit('board-update', { type: 'list-updated', list });
  }
  
  res.status(200).json(list);
});

const deleteList = asyncHandler(async (req, res) => {
  const { listId } = req.params;
  
  const result = await listService.deleteList(listId);
  
  const io = req.app.get('io');
  if (io && result.boardId) {
    io.to(result.boardId).emit('board-update', { type: 'list-deleted', listId });
  }
  
  res.status(200).json(result);
});

const reorderLists = asyncHandler(async (req, res) => {
  const { listIds } = req.body;
  const { boardId } = req.query;
  
  if (!boardId || !listIds) {
    return res.status(400).json({ success: false, message: 'boardId and listIds are required' });
  }
  
  const result = await listService.reorderLists(boardId, listIds);
  
  const io = req.app.get('io');
  if (io && boardId) {
    io.to(boardId).emit('board-update', { type: 'lists-reordered', listIds });
  }
  
  res.status(200).json(result);
});

module.exports = {
  createList,
  getLists,
  updateList,
  deleteList,
  reorderLists,
};