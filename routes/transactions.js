var express = require('express');
var router = express.Router();
var transactions = require('../controllers/transactions')


router.get('/',transactions.transactionsGet)
router.get('/all',transactions.allTransactionsGet)
router.post('/',transactions.transactionsPost)
router.put('/:id',transactions.transactionsPut)
module.exports = router;
