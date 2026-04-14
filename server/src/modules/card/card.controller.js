const { createCard, updateCard, deleteCard, moveCard, getCardsByList } = require("./card.service");

const getByList = async (req, res) => {
  try {
    const { listId } = req.query;
    
    if (!listId) {
      return res.status(400).json({ success: false, message: "listId is required" });
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

    const data = await createCard({ title, description, listId });

    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, assigneeId } = req.body;

    const data = await updateCard({ cardId, title, description, assigneeId });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { cardId } = req.params;

    const data = await deleteCard({ cardId });

    return res.status(200).json(data);
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

    const data = await moveCard({ cardId, newListId, position });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getByList, create, update, remove, move };