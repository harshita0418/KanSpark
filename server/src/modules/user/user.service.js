const User = require("./user.model");

exports.getAllUsers = async () => {
  return await User.find({}, 'name lastname email');
};

exports.createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

exports.searchUsers = async (query) => {
  return await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { lastname: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  }, 'name lastname email _id');
};
