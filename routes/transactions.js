var express = require('express');
var router = express.Router();
var transactions = require('../controllers/transactions')


router.get('/:id',transactions.transactionsGet)
router.get('/filter/:id',transactions.transactionsFilterGet)
router.get('/',transactions.allTransactionsGet)
router.get('/verification/:id/:token',transactions.transactionsVerificationGet)
router.post('/',transactions.transactionsPost)
router.post('/verification/:id/:token',transactions.transactionsVerificationPost)
router.put('/:id',transactions.transactionsPut)
module.exports = router;
