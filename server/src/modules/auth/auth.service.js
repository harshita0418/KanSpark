const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByEmail, createUser } = require("../config/db"); // adjust to your DB helper

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const registerUser = async ({ username, email, password }) => {
    // Check if user already exists
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("Email already in use");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user in DB
  const user = await createUser({ username, email, password: hashedPassword });

  // Generate token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
};

const loginUser = async ({ email, password }) => {
  // Find user
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
};

module.exports = { registerUser, loginUser };