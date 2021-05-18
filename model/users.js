const { token } = require('morgan');
const User = require('./schemas/user-schema');

const findById = async id => {
  return await User.findById({ _id: id });
};

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findByVarifyTokenEmail = async token => {
  return await User.findOne({ verifyTokenEmail: token });
};

const addUser = async userOptions => {
  const user = new User(userOptions);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateVarifyToken = async (id, verify, verifyToken) => {
  return await User.updateOne(
    { _id: id },
    { verify, verifyTokenEmail: verifyToken },
  );
};

const updateSubscription = async subscription => {
  return await User.findOneAndUpdate({ subscription });
};

const updateAvatar = async (id, avatar, idCloudAvatar = null) => {
  return await User.updateOne({ _id: id }, { avatar, idCloudAvatar });
};

module.exports = {
  findById,
  findByEmail,
  findByVarifyTokenEmail,
  addUser,
  updateToken,
  updateVarifyToken,
  updateSubscription,
  updateAvatar,
};
