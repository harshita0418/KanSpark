const express = require("express");
const router = express.Router();
const { register, login, forgot, reset } = require("./auth.controller");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/forgot-password
router.post("/forgot-password", forgot);

// POST /api/auth/reset-password
router.post("/reset-password", reset);

module.exports = router;
