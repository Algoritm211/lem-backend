const Router = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const AuthController = require('../controllers/auth.controller')
const passport = require('passport')
// eslint-disable-next-line no-unused-vars
const { passportGoogle } = require('../strategies/googleStrategy')

const router = new Router()


router.post('/registration', AuthController.registration)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/authorization', authMiddleware, AuthController.authenticate)

// Google auth

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  AuthController.socialAuth,
)

module.exports = router
