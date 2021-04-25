const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const listContacts = async () => {
  return db.get('contacts').value();
};

const getById = async id => {
  return db.get('contacts').find({ id }).value();
};

const removeContact = async id => {
  const [data] = db.get('contacts').remove({ id }).write();
  return data;
};

const addContact = async ({ name, email, phone }) => {
  const id = uuidv4();
  const contact = {
    id,
    name,
    email,
    phone,
  };
  db.get('contacts').push(contact).write();
  return contact;
};

const updateContact = async (id, body) => {
  const data = db.get('contacts').find({ id }).assign(body).value();
  db.write();
  return data.id ? data : null;
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
