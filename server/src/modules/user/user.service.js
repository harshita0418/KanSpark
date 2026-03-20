let users = [];

exports.getAllUsers = async () => users;

exports.createUser = async (data) => {
  const newUser = { id: users.length + 1, ...data };
  users.push(newUser);
  return newUser;
};
