const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { User, contacts, newContact } = require('../model/__mocks__/data');
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User.id }, JWT_SECRET_KEY);
User.token = token;

jest.mock('../model/contacts.js');
jest.mock('../model/users.js');

describe('Testing the route  api/contacts', () => {
  let idNewContact = null;
  describe('should handle GET request', () => {
    test('should return 200 status for GET: /contacts', async done => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Object);
      done();
    });
    test('should return 200 status for GET: /contacts/:id', async done => {
      const contact = contacts[0];
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact._id).toBe(contact._id);
      done();
    });
    test('should return 404 status for GET: /contacts/:id', async done => {
      const contact = contacts[0];
      const res = await request(app)
        .get(`/api/contacts/609d1a6ad35a12652b584914`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
      expect(res.body).toBeDefined();
      done();
    });
    test('should return 400 status for GET: /contacts/:id', async done => {
      const contact = contacts[0];
      const res = await request(app)
        .get(`/api/contacts/609d1a6ad35a1284914`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
  });

  describe('should handle POST request', () => {
    test('should return 201 status for POST: /contacts', async done => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(newContact);

      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      idNewContact = res.body.data.contact._id;

      done();
    });
    test('should return 400 status for POST: /contacts wrong field', async done => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ ...newContact, test: 1 });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
    test('should return 400 status for POST: /contacts without field', async done => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ phone: 1 });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
  });

  describe('should handle PUT request', () => {
    test('should return 200 status for PUT: /contacts/:id ', async done => {
      const res = await request(app)
        .put(`/api/contacts/${idNewContact}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ name: 'Test' });
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe('Test');
      done();
    });
    test('should return 400 status for PUT: /contacts/:id wrong field', async done => {
      const res = await request(app)
        .put('/api/contacts/1234')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ test: 1 });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
    test('should return 404 status for PUT: /contacts/:id', async done => {
      const res = await request(app)
        .put('/api/contacts/609d1acce01dfa659bc5332d')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ name: 'Vasiliy' });

      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
      done();
    });
  });

  describe('should handle PATCH request', () => {
    test('should return 200 status for PATCH: /contacts/:id/favorite ', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ favorite: true });
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.favorite).toBe(true);
      done();
    });
    test('should return 400 status for PATCH: /contacts/:id/favorite wrong field', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ test: 1 });

      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
    test('should return 404 status for PATCH: /contacts/:id/favorite', async done => {
      const res = await request(app)
        .patch('/api/contacts/609d1acce01dfa659bc5332d/favorite')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ favorite: true });

      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
      done();
    });
  });

  describe('should handle DELETE request', () => {
    const contact = contacts[1];
    test('should return 200 status for DELETE: /contacts/:id ', async done => {
      const res = await request(app)
        .delete(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact).toStrictEqual(contact);
      done();
    });
    test('should return 400 status for DELETE: /contacts/:id wrong field', async done => {
      const res = await request(app)
        .delete('/api/contacts/1234')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
    test('should return 404 status for DELETE: /contacts/:id', async done => {
      const res = await request(app)
        .delete('/api/contacts/609d1acce01dfa659bc5332b')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
      done();
    });
  });
});
