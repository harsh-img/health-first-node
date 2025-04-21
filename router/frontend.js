const express = require('express');
const router = express.Router();

const {getProductDetail,getProduct} = require('../controller/frontend');

router.get('/get-product-detail/:id',getProductDetail);
router.get('/get-products',getProduct);

module.exports = router;