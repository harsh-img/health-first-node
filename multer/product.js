// middleware/multer.js
const multer = require('multer');
const path = require('path');

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/products/'); // create this folder if not exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

// File filter (optional, for images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

const upload = multer({ storage: storage, fileFilter });

module.exports = upload;
