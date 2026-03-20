const service = require('./user.service');

exports.getUsers = async (req, res) => {
  const users = await service.getAllUsers();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const user = await service.createUser(req.body);
  res.status(201).json(user);
};
