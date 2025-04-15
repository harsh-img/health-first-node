const express = require('express');
const router = express.Router();
const category = require('../multer/category');

const { addCategory ,getCategory} = require('../controller/category');

router.post('/add', category.single('image'), addCategory);
router.get('/list',getCategory)

module.exports = router;
