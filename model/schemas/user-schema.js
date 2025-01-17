const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const { Subscription } = require('../../helper/constants');
const SALT_FACTOR = 6;
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /([a-z0-9_\\.-]+)@([a-z0-9_\\.-]+)\.([a-z\\.]{2,6})/;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: {
        values: [Subscription.STARTER, Subscription.PRO, Subscription.BUSSINES],
        message: "It's not allowed",
      },
      default: Subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true);
      },
    },
    idCloudAvatar: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyTokenEmail: {
      type: String,
      required: [true, 'Verify token is required'],
      default: nanoid(),
    },
  },

  {
    versionKey: false,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSaltSync(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

const User = model('user', userSchema);

module.exports = User;
