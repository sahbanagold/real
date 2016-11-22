let express = require('express');
let router = express.Router();
let warehouse = require('../controllers/warehouse')


router.get('/getOne/:id', warehouse.userGet)
router.get('/getAll', warehouse.allUserGet)
router.post('/', warehouse.userPost)
router.post('/activate/:id', warehouse.activateUserPost)
router.post('/deactivate/:id', warehouse.deactivateUserPost )

module.exports = router;
