const express = require('express');
const router = express.Router();

const { 
    createVarient , 
    getVarient ,
    createVarienAttribute ,
    getVarientAttribute ,
    createProduct,
    getProduct,
    createProductVarient,
    getProductVarient
} = require('../controller/product');
const upload = require('../multer/product');

//varient

router.post('/create-varient', createVarient);
router.get('/varient', getVarient);

//varient attribute

router.post('/create-varient-attribute',createVarienAttribute);
router.get('/get-varient-attribute',getVarientAttribute);

//product

router.post('/create-product', createProduct);
router.get('/get-product', getProduct);

//product varient
router.post('/create-product-varient/:id',upload.array('images',5),createProductVarient);
router.get('/get-product-varient/:id',getProductVarient);

module.exports = router;