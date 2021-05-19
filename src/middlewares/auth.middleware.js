const passport = require('../strategies/jwtStrategy')


const authMiddleware = (req, res, next) => {
  return passport.authenticate('jwt', {
    session: false,
  }, (err, user) => {
    // console.log(err, user)
    if (!user || err) {
      return res.status(500).json({
        status: 'error',
        error: 'Authentication failed',
      })
    }

    req.user = user
    next()
  })(req, res, next)
}


module.exports = authMiddleware
