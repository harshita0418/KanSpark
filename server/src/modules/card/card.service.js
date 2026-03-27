const Card = require("./card.model");

const createCard = async ({ title, description, listId, boardId, assigneeId }) => {
  if (!title || !listId || !boardId) {
    throw new Error("title, listId and boardId are required");
  }

  // Set position as last in the list
  const lastCard = await Card.findOne({ listId }).sort({ position: -1 });
  const position = lastCard ? lastCard.position + 1 : 0;

  const card = await Card.create({
    title,
    description,
    listId,
    boardId,
    assigneeId: assigneeId || null,
    position,
  });

  return card;
};

const updateCard = async ({ cardId, title, description, assigneeId }) => {
  const card = await Card.findById(cardId);

  if (!card) {
    throw new Error("Card not found");
  }

  if (title !== undefined) card.title = title;
  if (description !== undefined) card.description = description;
  if (assigneeId !== undefined) card.assigneeId = assigneeId;

  await card.save();

  return card;
};

const deleteCard = async ({ cardId }) => {
  const card = await Card.findById(cardId);

  if (!card) {
    throw new Error("Card not found");
  }

  await Card.deleteOne({ _id: cardId });

  return { message: "Card deleted successfully" };
};

const moveCard = async ({ cardId, listId, position }) => {
  const card = await Card.findById(cardId);

  if (!card) {
    throw new Error("Card not found");
  }

  if (listId !== undefined) card.listId = listId;
  if (position !== undefined) card.position = position;

  await card.save();

  return card;
};

module.exports = { createCard, updateCard, deleteCard, moveCard };
