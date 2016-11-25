let express = require('express');
let router = express.Router();
let seeds = require('../controllers/seeds')
router.get('/users', seeds.userSeeds)
// router.get('/warehouse', seeds.warehouseSeeds)
// router.get('/transactions', seeds.transactionsSeeds)
// router.get('/messages', seeds.messagesSeeds)
module.exports = router;
