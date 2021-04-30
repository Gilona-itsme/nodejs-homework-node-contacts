const express = require('express');
const router = express.Router();
const Contacts = require('../../model/contacts');
const validator = require('../../validations/valid-contacts-router');

const handlerError = require('../../helper/helper-error');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({
      status: 'success',
      code: 200,
      data: { contacts },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', validator.objectId, async (req, res, next) => {
  try {
    const contact = await Contacts.getById(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        data: { contact },
        message: 'Contact loaded',
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  validator.addContact,
  handlerError(async (req, res, next) => {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'contact add',
      data: { contact },
    });
  }),
);

router.delete('/:contactId', validator.objectId, async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        data: { contact },
        message: 'contact removed',
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', validator.updateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'contact update',
        data: { contact },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:contactId/favorite',
  validator.updateContact,
  async (req, res, next) => {
    try {
      const contact = await Contacts.updateContact(
        req.params.contactId,
        req.body,
      );
      if (contact) {
        return res.status(200).json({
          status: 'success',
          code: 200,
          message: 'contact update',
          data: { contact },
        });
      } else {
        return res.status(404).json({
          status: 'error',
          code: 404,
          data: 'Not found',
        });
      }
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
