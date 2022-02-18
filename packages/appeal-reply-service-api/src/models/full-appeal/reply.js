const Mongoose = require('mongoose');

const {
  baseReplySchema,
  deterministicReplySchema,
  nonDeterministicReplySchema,
} = require('./schema/replySchema');

const baseReplyModel = Mongoose.model('Reply-FullAppeal', baseReplySchema);

const DeterministicQuestionnaireModel = baseReplyModel.discriminator(
  'DeterministicReply',
  deterministicReplySchema
);
const NonDeterministicQuestionnaireModel = baseReplyModel.discriminator(
  'NonDeterministicReply',
  nonDeterministicReplySchema
);

module.exports = {
  DeterministicQuestionnaireModel,
  NonDeterministicQuestionnaireModel,
};
