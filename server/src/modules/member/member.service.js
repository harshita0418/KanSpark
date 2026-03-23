const BoardMember = require("./member.model");

const getBoardMembers = async ({ boardId }) => {
  const members = await BoardMember.find({ boardId }).populate(
    "userId",
    "username email"
  );

  if (!members || members.length === 0) {
    throw new Error("No members found for this board");
  }

  return members;
};

const addMember = async ({ boardId, userId, role }) => {
  const existing = await BoardMember.findOne({ boardId, userId });

  if (existing) {
    throw new Error("User is already a member of this board");
  }

  const member = await BoardMember.create({ boardId, userId, role });

  return member;
};

const updateMemberRole = async ({ boardId, userId, role }) => {
  const member = await BoardMember.findOne({ boardId, userId });

  if (!member) {
    throw new Error("Member not found on this board");
  }

  if (member.role === "owner") {
    throw new Error("Cannot change the role of the board owner");
  }

  member.role = role;
  await member.save();

  return member;
};

const removeMember = async ({ boardId, userId }) => {
  const member = await BoardMember.findOne({ boardId, userId });

  if (!member) {
    throw new Error("Member not found on this board");
  }

  if (member.role === "owner") {
    throw new Error("Cannot remove the board owner");
  }

  await BoardMember.deleteOne({ boardId, userId });

  return { message: "Member removed successfully" };
};

module.exports = { getBoardMembers, addMember, updateMemberRole, removeMember };
