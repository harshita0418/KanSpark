const { createCard, updateCard, deleteCard, moveCard } = require("./card.service");

const create = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, listId, assigneeId } = req.body;

    if (!listId) {
      return res.status(400).json({ success: false, message: "listId is required" });
    }

    const data = await createCard({ title, description, listId, boardId, assigneeId });

    return res.status(201).json({
      success: true,
      message: "Card created successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, assigneeId } = req.body;

    const data = await updateCard({ cardId, title, description, assigneeId });

    return res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { cardId } = req.params;

    const data = await deleteCard({ cardId });

    return res.status(200).json({
      success: true,
      message: data.message,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const move = async (req, res) => {
  try {
    const { cards, listId } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({
        success: false,
        message: "cards array is required",
      });
    }

    const data = await moveCard({ cards, listId });

    return res.status(200).json({
      success: true,
      message: data.message,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { create, update, remove, move };