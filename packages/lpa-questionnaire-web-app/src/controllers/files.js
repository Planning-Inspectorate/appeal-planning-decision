const { uploadFiles } = require('../lib/file-upload-helpers');
const { deleteDocument } = require('../lib/documents-api-wrapper');

exports.uploadFile = async (req, res) => {
  const { body } = req;
  const { errors = {}, files = {} } = body;

  if (!files.documents || !files.documents.length) {
    res.status(500);
    return;
  }

  const error = errors?.[`files.documents[0]`]?.msg;

  // even though multi file upload handles multiple files, it uploads files one at a time.
  let document = { ...files.documents[0], error };

  if (!error) {
    [document] = await uploadFiles(files.documents, req.session?.appealReply?.id);
  }

  const { name: fileName } = document;

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
      filename: document.id,
      originalname: fileName,
      id: document.id,
    },
  });
};

exports.deleteFile = async (req, res) => {
  const {
    body: { delete: deleteId = '' },
  } = req;

  if (!deleteId) {
    res.status(400).send('Delete required');
    return;
  }

  try {
    // deleteId will be 'undefined' if file upload error
    if (deleteId !== 'undefined') await deleteDocument(req.session.appealReply.id, deleteId);
  } catch (err) {
    res.status(404).send('Files to delete not found');
    return;
  }

  res.status(200).json({
    id: deleteId,
    success: {
      messageText: `${deleteId} deleted`,
    },
  });
};
