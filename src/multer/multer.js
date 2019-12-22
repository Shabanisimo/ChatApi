const multer = require('multer');

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './public/assets');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: Storage });

module.exports = upload;
