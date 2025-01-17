const passport = require('passport');
const { HttpCode } = require('./constants');
require('../config/password');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    let token = null;
    if (req.get('Authorization')) {
      token = req.get('Authorization').split(' ')[1];
    }

    if (!user || err || token !== user.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: '401 Unauthorized',
        code: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      });
    }
    req.user = user;
    //=> req.locals.user = user//
    return next();
  })(req, res, next);
};

module.exports = guard;
