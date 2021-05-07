const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/users');
const guard = require('../../helper/guard');
const rateLimit = require('express-rate-limit');
const validator = require('../../validations/valid-users-router');

// const handlerError = require('../../helper/helper-error');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 2, // limit each IP to 2 requests per windowMs
  handler: (req, res, next) => {
    return res.status(HttpCode.LIMITER).json({
      status: '429 error',
      code: HttpCode.LIMITER,
      message: 'Too Many Requests! Please try again later',
    });
  },
});

router.post('/signup', validator.addUser, limiter, ctrl.signup);
router.post('/login', validator.loginUser, ctrl.login);
router.post('/logout', guard, ctrl.logout);
router.get('/current', guard, ctrl.getCurrent);
router.patch('/', guard, validator.updateSub, ctrl.updateSubscriptionUser);

module.exports = router;