const multer = require('multer');
const config = require('./config');

const {
  fileUpload: { maxSizeInBytes, mimeTypes },
} = config;

const multerConfig = {
  limits: {
    fileSize: maxSizeInBytes,
  },
  storage: multer.memoryStorage(),
};

const uploadLocalFile = (req, res, next) => {
  multer(multerConfig).single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.log.warn('File too large');

        res.status(422).send({
          message: 'File too large',
          maxSize: maxSizeInBytes,
        });
        return;
      }

      next(err);
      return;
    }

    if (!req.file) {
      req.log.debug('No file uploaded');
      res.status(400).send({ message: 'No file uploaded' });
      return;
    }

    if (!mimeTypes.includes(req.file.mimetype)) {
      req.log.info(
        {
          mimeType: req.file.mimetype,
          allowed: mimeTypes,
        },
        'Invalid mime type'
      );
      res.status(400).send({
        message: 'Invalid mime type',
        mimeType: req.file.mimetype,
        allowed: mimeTypes,
      });
      return;
    }

    next();
  });
};

module.exports = uploadLocalFile;
