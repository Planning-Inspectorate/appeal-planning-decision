const { Schema, model } = require('mongoose');
const DocumentsMethod = require('./documentsMethods');

const DocumentsSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      immutable: true,
      index: {
        unique: true,
      },
    },
    applicationId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      required: true,
      index: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    // Location in Blob Storage
    location: {
      type: String,
      required: true,
    },
    upload: {
      processed: {
        type: Boolean,
        default: false,
      },
      processAttempts: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

DocumentsSchema.index({
  applicationId: 1,
  id: 1,
});

DocumentsSchema.index({
  createdAt: 1,
});

DocumentsSchema.index({
  'upload.processed': 1,
  'upload.processAttempts': 1,
});

DocumentsSchema.set('toObject', { virtuals: true });
DocumentsSchema.set('toJSON', { virtuals: true });

DocumentsSchema.virtual('blobStorageLocation').get(function getBlobStorageLocation() {
  return `${this.get('applicationId')}/${this.get('id')}/${this.get('name')}`;
});

DocumentsSchema.loadClass(DocumentsMethod);

module.exports = model('Document', DocumentsSchema);
