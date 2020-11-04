const { Schema, model } = require('mongoose');
const AppealsMethods = require('./appealsMethods');

const AppealSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      immutable: true,
      index: {
        unique: true,
      },
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

AppealSchema.loadClass(AppealsMethods);

module.exports = model('Appeal', AppealSchema);
