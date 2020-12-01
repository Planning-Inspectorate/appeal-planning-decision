const { Schema, model } = require('mongoose');

const FileUploadSchema = new Schema(
  {
    // uuid: {
    //   type: String,
    //   required: true,
    // },
    // _id: { type: Schema.Types.ObjectId },
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
