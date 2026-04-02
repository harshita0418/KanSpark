const service = require('./user.service');

exports.getUsers = async (req, res) => {
  const users = await service.getAllUsers();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const user = await service.createUser(req.body);
  res.status(201).json(user);
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }
    const users = await service.searchUsers(q);
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
