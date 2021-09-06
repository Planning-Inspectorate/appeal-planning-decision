const uuid = require('uuid');

const addFileMetadata = (req, res, next) => {
  if (!req.file) {
    req.file = {};
  }

  req.file.id = uuid.v4();
  req.file.uploadDate = new Date().toISOString();
  next();
};

module.exports = addFileMetadata;
