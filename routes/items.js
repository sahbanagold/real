let express = require('express');
let router = express.Router();
let items = require('../controllers/items')




router.get('/', items.itemGet)
router.post('/', items.itemPost)

module.exports = router;
