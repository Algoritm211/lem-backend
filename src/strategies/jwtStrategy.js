const { Strategy } = require('passport-jwt')
const User = require('../models/User')
const passport = require('passport')

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies['authToken']
  }
  return null
}

passport.use('jwt', new Strategy( {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.secretKey,
}, async (token, done) => {
  try {
    const user = await User.findOne({ _id: token.id })

    if (!user) {
      return done(null, false)
    }

    return done(null, user)
  } catch (e) {
    return done(e, false)
  }
}))

module.exports = passport
