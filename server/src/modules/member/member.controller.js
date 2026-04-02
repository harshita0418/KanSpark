const { getBoardMembers, addMember, updateMemberRole, removeMember } = require("./member.service");

const getMembers = async (req, res) => {
  try {
    const { boardId } = req.params;

    const data = await getBoardMembers(boardId);

    return res.status(200).json({
      success: true,
      message: "Board members fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const addBoardMember = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId, role } = req.body;

    console.log('addBoardMember controller - boardId:', boardId, 'userId:', userId, 'role:', role);

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const data = await addMember(boardId, userId, role);

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { boardId, userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "role is required" });
    }

    const data = await updateMemberRole(boardId, userId, role);

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { boardId, userId } = req.params;

    const data = await removeMember(boardId, userId);

    return res.status(200).json({
      success: true,
      message: data.message,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getMembers, addBoardMember, updateRole, deleteMember };