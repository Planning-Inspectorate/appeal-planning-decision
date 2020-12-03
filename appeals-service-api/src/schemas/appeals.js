const { Schema, model } = require('mongoose');
const AppealsMethods = require('./appealsMethods');
const FileUpload = require('./fileUpload');

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
    'application-number': {
      type: String,
    },
    'application-upload': {
      type: FileUpload.schema,
    },
    'decision-upload': {
      type: FileUpload.schema,
    },
    'appeal-upload': {
      type: FileUpload.schema,
    },
    'appeal-non-sensitive': {
      type: Boolean,
    },
    'appeal-other-uploads': {
      type: [FileUpload.schema],
      default: [],
    },
    'active-appeal': {
      type: Boolean,
    },
    'active-appeal-numbers': {
      type: String,
    },
    'site-address-line-one': {
      type: String,
    },
    'site-address-line-two': {
      type: String,
    },
    'site-town-city': {
      type: String,
    },
    'site-county': {
      type: String,
    },
    'site-postcode': {
      type: String,
    },
    'site-ownership': {
      type: Boolean,
    },
    'inform-owners': {
      type: Boolean,
    },
    'site-view': {
      type: Boolean,
    },
    'site-restrictions': {
      type: String,
    },
    'safety-concerns': {
      type: Boolean,
    },
    'safety-information': {
      type: String,
    },
    'local-planning-authority': {
      type: String,
    },
    'description-development': {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

AppealSchema.loadClass(AppealsMethods);

module.exports = model('Appeal', AppealSchema);
