let express = require('express');
let router = express.Router();
let users = require('../controllers/users')


router.get('/getOne/:id', users.userGet)
router.get('/getAll', users.allUserGet)
router.post('/', users.userPost)
router.post('/activate/:id', users.activateUserPost)
router.post('/deactivate/:id', users.deactivateUserPost )

module.exports = router;
