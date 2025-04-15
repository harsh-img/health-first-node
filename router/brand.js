const express = require('express');
const router = express.Router();
const upload = require('../multer/brand');
const { addBrand ,getBrand} = require('../controller/brand');

router.post('/add',upload.single('image'), addBrand);
router.get('/list', getBrand);

module.exports = router;