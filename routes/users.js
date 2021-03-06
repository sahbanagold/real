let express = require('express');
let router = express.Router();
let users = require('../controllers/users')
let passport = require('passport')


router.get('/:id', users.userGet)
router.get('/', users.allUserGet)
router.get('/filter/active', users.activeUserGet)
router.get('/profile/fix',users.fixProfile)
router.post('/', users.userRegisterPost)
router.post('/profile/upload',users.userProfilePost)
router.post('/activate/:id', users.activateUserPost)
router.post('/deactivate/:id', users.deactivateUserPost )
router.post('/login',
passport.authenticate('local-login', {successRedirect : '/home', failureRedirect : '/', failureFlash : true}));

module.exports = router;
