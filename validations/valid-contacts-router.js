const Joi = require('joi');

const schemaAddContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{3}[-][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/, 'phone')
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{3}[-][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/, 'phone')
    .optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
}).or('name', 'email', 'phone');

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    return next();
  } catch (err) {
    console.log(err);
    next({ status: 400, message: err.message.replace(/"/g, "'") });
  }
};

module.exports = {
  addContact: async (req, res, next) => {
    return await validate(schemaAddContact, req.body, next);
  },
  updateContact: async (req, res, next) => {
    return await validate(schemaUpdateContact, req.body, next);
  },
};
