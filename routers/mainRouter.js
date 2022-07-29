const { Router } = require('express');
const router = Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.homePage);
router.get('/about', mainController.aboutPage);
router.get('/contact', mainController.contactPage);
router.get('/signin', mainController.signInPage);
router.get('/signup', mainController.signUpPage);
router.get('/private', mainController.toAllow, mainController.privatePage);

router.post('/signup', mainController.signUp);
router.post('/signin', mainController.signIn);

router.get('/signout', mainController.signOut);

module.exports = router;