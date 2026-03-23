const express = require("express");
const router = express.Router({ mergeParams: true });
const { getMembers, addBoardMember, updateRole, deleteMember } = require("./member.controller");
const { protect } = require("../auth/auth.middleware");
const { isBoardMember, isBoardOwner } = require("./member.middleware");

// GET /api/boards/:boardId/members
router.get("/", protect, isBoardMember, getMembers);

// POST /api/boards/:boardId/members
router.post("/", protect, isBoardOwner, addBoardMember);

// PATCH /api/boards/:boardId/members/:userId
router.patch("/:userId", protect, isBoardOwner, updateRole);

// DELETE /api/boards/:boardId/members/:userId
router.delete("/:userId", protect, isBoardOwner, deleteMember);

module.exports = router;
