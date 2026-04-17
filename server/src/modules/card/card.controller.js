const { createCard, updateCard, deleteCard, moveCard, getCardsByList } = require("./card.service");

const getByList = async (req, res) => {
  try {
    const { listId, boardId } = req.query;
    
    if (!listId && !boardId) {
      return res.status(400).json({ success: false, message: "listId or boardId is required" });
    }

    if (boardId) {
      const cards = await getCardsByList(boardId);
      return res.status(200).json(cards);
    }

    const cards = await getCardsByList(listId);

    return res.status(200).json(cards);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, listId } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ success: false, message: "title and listId are required" });
    }

    const card = await createCard({ title, description, listId });

    const io = req.app.get('io');
    if (io && card.boardId) {
      io.to(card.boardId.toString()).emit('board-update', { type: 'card-created', card });
    }

    return res.status(201).json(card);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, assigneeId } = req.body;

    const card = await updateCard({ cardId, title, description, assigneeId });

    const io = req.app.get('io');
    if (io && card.boardId) {
      io.to(card.boardId.toString()).emit('board-update', { type: 'card-updated', card });
    }

    return res.status(200).json(card);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await deleteCard({ cardId });

    const io = req.app.get('io');
    if (io && card.boardId) {
      io.to(card.boardId.toString()).emit('board-update', { type: 'card-deleted', cardId });
    }

    return res.status(200).json(card);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const move = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { newListId, position } = req.body;

    if (!newListId || position === undefined) {
      return res.status(400).json({
        success: false,
        message: "newListId and position are required",
      });
    }

    const card = await moveCard({ cardId, newListId, position });

    const io = req.app.get('io');
    if (io && card.boardId) {
      io.to(card.boardId.toString()).emit('board-update', { type: 'card-moved', card });
    }

    return res.status(200).json(card);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getByList, create, update, remove, move };