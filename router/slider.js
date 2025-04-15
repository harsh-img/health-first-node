const express = require('express');
const router = express.Router();
const upload = require('../multer/slider');

const {addSlider,getSlider} = require('../controller/slider');

router.post('/add', upload.single('image'), addSlider);
router.get('/list', getSlider);

module.exports = router;