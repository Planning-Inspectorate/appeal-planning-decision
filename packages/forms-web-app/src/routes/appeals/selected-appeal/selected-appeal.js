const express = require('express');

const selectedAppealController = require('../../../controllers/selected-appeal');
const appealDetailsController = require('../../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../../controllers/selected-appeal/questionnaire-details');
// const finalCommentsController = require('../../../controllers/selected-appeal/final-comments-details');
// const interestedPartyDetailsController = require('../../../controllers/selected-appeal/ip-comment-details');
// const statementDetailsController = require('../../../controllers/selected-appeal/statements');
const planningObligationDetailsController = require('../../../controllers/selected-appeal/planning-obligation-details');

const representationsController = require('../../../controllers/selected-appeal/representations');
const {
	LPA_USER_ROLE,
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');

const router = express.Router({ mergeParams: true });

const userType = APPEAL_USER_ROLES.APPELLANT;

const interestedPartyParams = {
	userType,
	representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
	submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
};

const lpaFinalCommentParams = {
	userType,
	representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
	submittingParty: LPA_USER_ROLE
};

const appellantFinalCommentParams = {
	userType,
	representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
	submittingParty: APPEAL_USER_ROLES.APPELLANT
};

const lpaStatementParams = {
	userType,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	submittingParty: LPA_USER_ROLE
};

router.get('/:appealNumber', selectedAppealController.get());
router.get('/:appealNumber/appeal-details', appealDetailsController.get());
router.get('/:appealNumber/questionnaire', questionnaireDetailsController.get());
router.get(
	'/:appealNumber/final-comments',
	representationsController.get(appellantFinalCommentParams)
);
router.get(
	'/:appealNumber/lpa-final-comments',
	representationsController.get(lpaFinalCommentParams)
);
router.get(
	'/:appealNumber/interested-party-comments',
	representationsController.get(interestedPartyParams)
);
router.get('/:appealNumber/lpa-statement', representationsController.get(lpaStatementParams));
router.get('/:appealNumber/planning-obligation', planningObligationDetailsController.get());

module.exports = router;
