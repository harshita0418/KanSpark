const List = require('./list.model');

const createList = async ({ title, boardId }) => {
  if (!title || !boardId) {
    throw new Error('title and boardId are required');
  }

  const lastList = await List.findOne({ boardId }).sort({ position: -1 });
  const position = lastList ? lastList.position + 1 : 0;

  const list = await List.create({
    title,
    boardId,
    position,
  });

  return list;
};

const getListsByBoard = async (boardId) => {
  const lists = await List.find({ boardId }).sort({ position: 1 });
  return lists;
};

const updateList = async ({ listId, title, position }) => {
  const list = await List.findById(listId);
  if (!list) {
    throw new Error('List not found');
  }

  if (title !== undefined) list.title = title;
  if (position !== undefined) list.position = position;

  await list.save();
  return list;
};

const deleteList = async (listId) => {
  const list = await List.findById(listId);
  if (!list) {
    throw new Error('List not found');
  }

  await List.deleteOne({ _id: listId });
  return { message: 'List deleted successfully' };
};

const reorderLists = async (boardId, listIds) => {
  if (!listIds || !Array.isArray(listIds)) {
    throw new Error('listIds array is required');
  }

  const bulkOps = listIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, boardId },
      update: { $set: { position: index } },
    },
  }));

  await List.bulkWrite(bulkOps);
  return { message: 'Lists reordered successfully' };
};

module.exports = {
  createList,
  getListsByBoard,
  updateList,
  deleteList,
  reorderLists,
};