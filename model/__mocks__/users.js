const { users } = require('./data');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const findById = jest.fn(id => {
  const [user] = users.filter(el => String(el._id) === String(id));
  return user;
});

const findByEmail = jest.fn(email => {
  const [user] = users.filter(el => String(el.email) === String(email));
  return user;
});

const addUser = jest.fn(({ email, password }) => {
  pass = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
  const newUser = {
    email,
    password: pass,
    _id: '609bd061a354bc44effbc222',
    id: '609bd061a354bc44effbc222',
    validPassword: function (pass) {
      return bcrypt.compareSync(pass, this.password);
    },
  };
  users.push(newUser);
  return newUser;
});

const updateToken = jest.fn((id, token) => {
  return {};
});

const updateSubscription = jest.fn(subscription => {
  let [contact] = contacts.filter(el => String(el._id) === String(id));

  if (contact) {
    contact = { ...contact, ...body };
  }
  return contact;
});

const updateAvatar = jest.fn((id, avatar, idCloudAvatar = null) => {
  const [user] = users.filter(el => String(el._id) === String(id));
  user.avatar = avatar;
  user.idCloudAvatar = idCloudAvatar;
  return user;
});

module.exports = {
  findById,
  findByEmail,
  addUser,
  updateToken,
  updateSubscription,
  updateAvatar,
};
