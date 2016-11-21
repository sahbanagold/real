var express = require('express');
var router = express.Router();
var transactions = require('../controllers/transactions')


router.get('/',transactions.transactionsGet);
router.post('/',transactions.transactionsPost);
module.exports = router;
