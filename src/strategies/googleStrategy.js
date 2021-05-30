const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/User')

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.mainURL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const user = await User.findOne({ email: email })

        if (user) {
          return done(null, user, { statusCode: 200 })
        }

        const userName = profile.name.familyName
        const userPhoto = profile.photos[0].value

        const userObj = {
          googleId: profile.id,
          name: userName,
          email: email,
          avatar: { url: userPhoto, name: 'userPhoto' },
          password: profile.id,
        }
        return done(null, userObj, { statusCode: 404 })
      } catch (err) {
        done(err, false)
      }
    },
  ),
)

module.exports = passport
