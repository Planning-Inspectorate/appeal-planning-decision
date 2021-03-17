const { deleteFile } = require('../lib/file-upload-helpers');

exports.uploadFile = async (req, res) => {
  const { body } = req;
  const { errors = {}, files = {} } = body;

  if (!files.documents || !files.documents.length) {
    res.status(500);
    return;
  }

  // even though multi file upload handles multiple files, it uploads files one at a time.
  const documentWithErrors = {
    ...files.documents[0],
    error: errors?.[`files.documents[0]`]?.msg,
  };

  // push all files to uploaded files to keep errors after post
  req.session.uploadedFiles = [...(req.session.uploadedFiles || []), documentWithErrors];

  const { name: fileName, error } = documentWithErrors;

  const response = error
    ? {
        error: {
          message: error,
        },
      }
    : {
        success: {
          messageHtml: fileName,
        },
      };

  res.status(200).json({
    ...response,
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

  try {
    deleteFile(deleteId, req);
  } catch (err) {
    res.status(404).send('Files to delete not found');
    return;
  }

  res.status(200).json({
    success: {
      messageText: `${deleteId} deleted`,
    },
  });
};
