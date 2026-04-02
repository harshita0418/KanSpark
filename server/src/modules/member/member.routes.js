const express = require("express");
const router = express.Router();
const { getMembers, addBoardMember, updateRole, deleteMember } = require("./member.controller");
const { protect } = require("../auth/auth.middleware");
const { isBoardMember, isBoardOwner } = require("./member.middleware");

// GET /api/members/:boardId/members
router.get("/:boardId/members", protect, isBoardMember, getMembers);

// POST /api/members/:boardId/members
router.post("/:boardId/members", protect, isBoardOwner, addBoardMember);

// PATCH /api/members/:boardId/members/:userId
router.patch("/:boardId/members/:userId", protect, isBoardOwner, updateRole);

// DELETE /api/members/:boardId/members/:userId
router.delete("/:boardId/members/:userId", protect, isBoardOwner, deleteMember);

module.exports = router;