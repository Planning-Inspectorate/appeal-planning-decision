const { documentTypes } = require('@pins/common');

const isValidDocumentType = (documentType) => {
  return documentType && Object.values(documentTypes).some(({ name }) => name === documentType);
};

const documentTypeValidator = (req, res, next) => {
  const { documentType } = req.params;

  if (isValidDocumentType(documentType)) {
    return next();
  }

  return res.status(500).json({
    error: {
      message: 'Unable to upload document',
    },
  });
};

module.exports = documentTypeValidator;
