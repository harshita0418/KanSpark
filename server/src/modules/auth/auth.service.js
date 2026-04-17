const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../user/user.model");
const { sendResetEmail } = require("../../utils/mail.service");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const registerUser = async ({ name, lastname, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already in use");
  }

  const user = await User.create({ name, lastname, email, password });

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { 
      id: user._id, 
      name: user.name, 
      lastname: user.lastname,
      email: user.email 
    },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { 
      id: user._id, 
      name: user.name, 
      lastname: user.lastname,
      email: user.email 
    },
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

  await user.save();

  await sendResetEmail(email, resetToken);
};

const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  const jwtToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token: jwtToken,
    user: {
      id: user._id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
    },
  };
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
