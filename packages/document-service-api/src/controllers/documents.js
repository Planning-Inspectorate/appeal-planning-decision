const multer = require('multer');
const config = require('../lib/config');
const Documents = require('../schemas/documents');
const {
  uploadDocumentsToBlobStorage,
  deleteFromBlobStorageByLocation,
} = require('../services/upload.service');

module.exports = {
  async getDocsForApplication(req, res) {
    const docs = await Documents.find({
      applicationId: req.params.applicationId,
    });

    if (docs.length === 0) {
      req.log.debug('Unknown application ID');

      res.status(404).send({
        message: 'Unknown application ID',
      });
      return;
    }

    res.send(docs.map((item) => item.toDTO()));
  },

  async getDocumentById(req, res) {
    const search = {
      applicationId: req.params.applicationId,
      id: req.params.documentId,
    };

    const doc = await Documents.findOne(search);

    if (!doc) {
      req.log.debug(search, 'Unknown document ID');

      res.status(404).send({
        message: 'Unknown document ID',
      });
      return;
    }

    res.send(doc);
  },

  async serveDocumentById(req, res) {
    const search = {
      applicationId: req.params.applicationId,
      id: req.params.documentId,
    };

    const doc = await Documents.findOne(search);

    if (!doc) {
      req.log.debug(search, 'Unknown document ID');

      res.status(404).send({
        message: 'Unknown document ID',
      });
      return;
    }

    req.log.info('Downloading file from blob storage');

    const fileBuffer = await doc.downloadFileBuffer();

    const displayBase64 = req.query.base64 === 'true';

    if (displayBase64) {
      req.log.info('Converting file to base64');
      const fileData = fileBuffer.toString('base64');

      res.send({
        ...doc.toDTO(),
        dataSize: fileData.length, // Use length as base64 is different to stored data size
        data: fileData,
      });
    } else {
      const mimeType = doc.get('mimeType');
      req.log.info({ mimeType }, 'Displaying file');

      res.set('content-type', mimeType);

      res.send(fileBuffer);
    }
  },

  uploadDocument: [
    (req, res, next) => {
      /* Upload the file to disk and perform basic validation */
      multer({
        limits: {
          fileSize: config.fileUpload.maxSizeInBytes,
        },
        storage: multer.diskStorage({
          destination: config.fileUpload.path,
        }),
      }).single('file')(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            req.log.warn('File too large');

            res.status(422).send({
              message: 'File too large',
              maxSize: config.fileUpload.maxSizeInBytes,
            });
            return;
          }

          /* Not a Multer error - continue up the chain */
          next(err);
          return;
        }

        next();
      });
    },
    async (req, res) => {
      /* Save the file data to DB and upload to Blob Storage */
      const {
        file,
        params: { applicationId },
      } = req;

      req.log.info({ file, applicationId }, 'Uploading new file');

      /* Check file uploaded */
      if (!req.file) {
        req.log.debug('No file uploaded');

        res.status(400).send({ message: 'No file uploaded' });
        return;
      }

      /* Check mime type */
      if (!config.fileUpload.mimeTypes.includes(file.mimetype)) {
        req.log.info(
          {
            mimeType: file.mimetype,
            allowed: config.fileUpload.mimeTypes,
          },
          'Invalid mime type'
        );
        res.status(400).send({
          message: 'Invalid mime type',
          mimeType: file.mimetype,
          allowed: config.fileUpload.mimeTypes,
        });
        return;
      }

      const doc = new Documents({
        applicationId,
        name: file.originalname,
        uploadDate: new Date(),
        mimeType: file.mimetype,
        location: file.filename,
        size: file.size,
      });

      doc.generateId();

      try {
        await doc.validate();
      } catch (err) {
        /* Set as "warn" as this is data is generated here */
        req.log.warn({ err }, 'Document not validated');
        res.status(400).send(err);
        return;
      }

      await doc.save();

      try {
        req.log.info(
          {
            applicationId,
            docId: doc.get('id'),
          },
          'Uploading document to blob storage'
        );

        await uploadDocumentsToBlobStorage([doc]);

        res.status(202).send(doc.toDTO());
      } catch (err) {
        req.log.error({ err }, 'Document not uploaded to the blob storage');
        res.status(400).send(err);
      }
    },
  ],
  deleteDocument: async (req, res) => {
    const { documentId, applicationId } = req.params;
    const search = {
      applicationId,
      id: documentId,
    };

    const doc = await Documents.findOne(search);

    if (!doc) {
      req.log.debug(search, 'Unknown document ID');

      res.status(404).send({
        message: 'Unknown document ID',
      });
      return;
    }

    try {
      const { deletedCount } = await Documents.deleteOne(search);
      if (deletedCount === 0) {
        req.log.debug(search, 'Unknown document ID');

        res.status(404).send({
          message: 'Unknown document ID',
        });
        return;
      }
    } catch (err) {
      req.log.error({ err }, 'Failed to delete document from database.');
      res.status(500).send(err);
      return;
    }

    const success = await deleteFromBlobStorageByLocation(doc.blobStorageLocation);

    if (!success) {
      req.log.error('Failed to delete document from blob storage.');
      res.status(500).send();
      return;
    }

    res.status(204).send();
  },
};
