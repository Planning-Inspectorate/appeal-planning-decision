const { Schema, model } = require('mongoose');
const DocumentsMethod = require('./documentsMethods');

const DocumentsSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      immutable: true,
      index: {
        unique: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

DocumentsSchema.loadClass(DocumentsMethod);

module.exports = model('Document', DocumentsSchema);
