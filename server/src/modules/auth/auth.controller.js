const { registerUser, loginUser } = require("./auth.service");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const data = await registerUser({ username, email, password });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const data = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };