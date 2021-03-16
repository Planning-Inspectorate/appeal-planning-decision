const { deleteDocument } = require('../lib/documents-api-wrapper');

exports.uploadFile = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [], files = {} } = body;

  if (!files.documents || !files.documents.length) {
    res.status(500);
    return;
  }

  // even though multi file upload handles multiple files, it uploads files one at a time.
  const { name: fileName } = files.documents[0];

  if (Object.keys(errors).length > 0) {
    res.json({
      error: {
        message: errors?.['files.documents[0]']?.msg,
        summary: errorSummary.map((error) => ({
          ...error,
          url: '#documents',
        })),
      },
      file: {
        filename: fileName,
        originalname: fileName,
      },
    });
    return;
  }

  // only push valid files to uploadedFiles
  if (!req.session.uploadedFiles) {
    req.session.uploadedFiles = [files.documents[0]];
  } else {
    req.session.uploadedFiles.push(files.documents[0]);
  }

  res.status(200).json({
    success: {
      messageText: fileName,
      messageHtml: fileName,
    },
    file: {
      filename: fileName,
      originalname: fileName,
    },
  });
};

exports.deleteFile = async (req, res) => {
  if (!req.session) {
    res.status(500).send('No session data found');
    return;
  }

  const {
    body: { delete: deleteId = '' },
  } = req;

  if (!deleteId) {
    res.status(400).send('Delete required');
    return;
  }

  const file = req.session.uploadedFiles?.find((upload) => upload.name === deleteId);

  if (!file) {
    // try to delete file from doc store. if that fails, doc must be missing
    try {
      await deleteDocument(deleteId);
    } catch (err) {
      req.log.error({ err }, 'Error from documents service');
      res.status(404).send('File not found');
      return;
    }
  } else {
    req.session.uploadedFiles = req.session.uploadedFiles.filter(
      (upload) => upload.name !== deleteId
    );
  }

  res.status(200).json({
    success: {
      messageText: `${deleteId} deleted`,
    },
  });
};
