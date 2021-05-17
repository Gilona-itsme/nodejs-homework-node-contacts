const contacts = [
  {
    _id: '609d1acce01dfa659bc5332a',
    name: 'Helli',
    email: 'helli@ukr.net',
    phone: '(405) 475-6978',
    // owner: '609bd061a354bc44effbc223',
    favorite: false,
  },
  {
    favorite: true,
    name: 'Dimas',
    email: 'dima@ukr.net',
    phone: '(465) 345-4456',
    // owner: '609bd061a354bc44effbc223',
    _id: '609d1acce01dfa659bc5332b',
    id: '609d1acce01dfa659bc5332b',
  },
];

const newContact = {
  favorite: false,
  name: 'Ilona',
  email: 'ilona@ukr.net',
  phone: '(405) 475-6978',
};

const User = {
  subscription: 'pro',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOWJkMDYxYTM1NGJjNDRlZmZiYzIyMyIsImlhdCI6MTYyMTI0Nzc2NSwiZXhwIjoxNjIxMjU0OTY1fQ.F-LyeVCSDraGEo9J24Q6CJPSTHFgaO5bFHgKgVqOAhc',
  _id: '609bd061a354bc44effbc223',
  id: '609bd061a354bc44effbc223',
  email: 'test@test.com',
  password: '$2a$06$1F4lRljBACZeUPb1P.xE6.7AQL/2qBY/MHlnHY1tXD4H/JXIF3Nm2',
  avatarUrl:
    'https://res.cloudinary.com/goitnode/image/upload/v1620905534/Avatars/eikflgm8y4wfuhznionw.png',
  idCloudAvatar: 'Avatars/eikflgm8y4wfuhznionw',
};

const users = [];
users[0] = User;

const newUser = {
  email: 'test5@test.com',
  password: '123456',
};

module.exports = { contacts, newContact, User, users, newUser };
