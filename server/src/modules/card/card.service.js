const mongoose = require("mongoose");
const Card = require("./card.model");
const List = require("../list/list.model");

const getCardsByList = async (listId) => {
  const cards = await Card.find({ listId }).sort({ position: 1 });
  return cards;
};

const createCard = async ({ title, description, listId, boardId }) => {
  if (!title || !listId) {
    throw new Error("title and listId are required");
  }

  const list = await List.findById(listId);
  if (!list) {
    throw new Error("List not found");
  }

  const lastCard = await Card.findOne({ listId }).sort({ position: -1 });
  const position = lastCard ? lastCard.position + 1 : 0;

  const card = await Card.create({
    title,
    description: description || "",
    listId,
    boardId: list.boardId,
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

const moveCard = async ({ cardId, newListId, position }) => {
  const card = await Card.findById(cardId);
  if (!card) {
    throw new Error("Card not found");
  }

  const list = await List.findById(newListId);
  if (!list) {
    throw new Error("List not found");
  }

  card.listId = newListId;
  card.boardId = list.boardId;
  card.position = position;
  await card.save();

  return card;
};

module.exports = { getCardsByList, createCard, updateCard, deleteCard, moveCard };