const uuid = require('uuid');
const {
  TYPE_OF_PLANNING_APPLICATION: { HOUSEHOLDER_PLANNING },
  APPLICATION_DECISION: { NODECISIONRECEIVED },
} = require('@pins/business-rules/src/constants');
const {
  NonDeterministicQuestionnaireModel,
  DeterministicQuestionnaireModel,
} = require('../models/full-appeal/reply');
const ReplyModel = require('../models/replySchema');

module.exports = (appealId, appealType, applicationDecision) => {
  const replyModel = {
    id: uuid.v4(),
    appealId,
  };

  // !appealType check not needed once all the existing tests to include appealType in their appeal
  if (!appealType || appealType === HOUSEHOLDER_PLANNING) {
    return new ReplyModel(replyModel);
  }

  if (applicationDecision === NODECISIONRECEIVED) {
    return new NonDeterministicQuestionnaireModel(replyModel);
  }

  return new DeterministicQuestionnaireModel(replyModel);
};
