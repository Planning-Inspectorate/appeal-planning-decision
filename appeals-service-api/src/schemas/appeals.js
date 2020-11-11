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
    appellantName: {
      type: String,
      required: true,
    },
    appellantEmail: {
      type: String,
      required: true,
    },
    planningApplicationNumber: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

AppealSchema.loadClass(AppealsMethods);

module.exports = model('Appeal', AppealSchema);
