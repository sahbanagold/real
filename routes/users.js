let express = require('express');
let router = express.Router();
let users = require('../controllers/users')
let passport = require('passport')


router.get('/getOne/:id', users.userGet)
router.get('/getAll', users.allUserGet)
router.post('/', users.userRegisterPost)
router.post('/activate/:id', users.activateUserPost)
router.post('/deactivate/:id', users.deactivateUserPost )
router.post('/login',
passport.authenticate('local-login', {successRedirect : '/', failureRedirect : '/login', failureFlash : true}));
module.exports = router;
