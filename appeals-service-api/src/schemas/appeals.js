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
    'original-appellant': {
      type: Boolean,
    },
    'appellant-name': {
      type: String,
    },
    'appellant-email': {
      type: String,
    },
    'behalf-appellant-name': {
      type: String,
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
