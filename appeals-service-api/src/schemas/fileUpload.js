const { Schema, model } = require('mongoose');

const FileUploadSchema = new Schema(
  {
    fileName: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = model('FileUpload', FileUploadSchema);
