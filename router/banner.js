const express = require('express');
const router = express.Router();
const upload = require('../multer/banner');

const { addBanner ,getBanner} = require('../controller/banner');

router.post('/add', upload.single('image'), addBanner);
router.get('/list', getBanner);

module.exports = router;