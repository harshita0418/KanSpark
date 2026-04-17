const { registerUser, loginUser, forgotPassword, resetPassword } = require("./auth.service");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const register = asyncHandler(async (req, res, next) => {
  const { name, lastname, email, password } = req.body;

  if (!name || !lastname || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required" 
    });
  }

  const data = await registerUser({ name, lastname, email, password });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required" 
    });
  }

  const data = await loginUser({ email, password });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data,
  });
});

const forgot = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email is required" 
    });
  }

  await forgotPassword(email);

  return res.status(200).json({
    success: true,
    message: "Password reset email sent if email exists",
  });
});

const reset = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Token and password are required" 
    });
  }

  const data = await resetPassword(token, password);

  return res.status(200).json({
    success: true,
    message: "Password reset successful",
    data,
  });
});

module.exports = { register, login, forgot, reset };
