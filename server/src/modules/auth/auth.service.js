const jwt = require("jsonwebtoken");
const User = require("../user/user.model");

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


module.exports = { registerUser, loginUser };
