let express = require('express');
let router = express.Router();
let warehouse = require('../controllers/warehouse')


router.get('/:id', warehouse.warehouseGet)
router.get('/', warehouse.warehouseGetAll)
router.post('/', warehouse.warehousePost)
router.delete('/:id',warehouse.warehouseDelete)
router.put('/', warehouse.warehousePut)

module.exports = router;
