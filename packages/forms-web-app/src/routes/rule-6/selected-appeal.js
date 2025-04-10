const express = require('express');
const router = express.Router({ mergeParams: true });

const selectedAppealController = require('../../controllers/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../controllers/selected-appeal/questionnaire-details');
const planningObligationDetailsController = require('../../controllers/selected-appeal/planning-obligation-details');
const representationsController = require('../../controllers/selected-appeal/representations');

const {
	LPA_USER_ROLE,
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');

const userType = APPEAL_USER_ROLES.RULE_6_PARTY;

const lpaStatementParams = {
	userType,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	submittingParty: LPA_USER_ROLE
};

const ownStatementParams = {
	userType,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY,
	rule6OwnRepresentations: true
};

const otherPartyStatementsParams = {
	userType,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY,
	rule6OwnRepresentations: false
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

const ownProofParams = {
	userType,
	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
	submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY,
	rule6OwnRepresentations: true
};

const appellantProofParams = {
	userType,
	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
	submittingParty: APPEAL_USER_ROLES.APPELLANT
};

const lpaProofParams = {
	userType,
	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
	submittingParty: LPA_USER_ROLE
};

const otherPartyProofParams = {
	userType,
	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
	submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY,
	rule6OwnRepresentations: false
};

const interestedPartyParams = {
	userType,
	representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
	submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
};

router.get('/:appealNumber', selectedAppealController.get());
router.get('/:appealNumber/appeal-details', appealDetailsController.get());
router.get('/:appealNumber/questionnaire', questionnaireDetailsController.get());

router.get('/:appealNumber/lpa-statement', representationsController.get(lpaStatementParams));
router.get('/:appealNumber/statement', representationsController.get(ownStatementParams));
router.get(
	'/:appealNumber/other-party-statements',
	representationsController.get(otherPartyStatementsParams)
);

router.get(
	'/:appealNumber/lpa-final-comments',
	representationsController.get(lpaFinalCommentParams)
);
router.get(
	'/:appealNumber/appellant-final-comments',
	representationsController.get(appellantFinalCommentParams)
);

router.get('/:appealNumber/proof-evidence', representationsController.get(ownProofParams));
router.get(
	'/:appealNumber/appellant-proof-evidence',
	representationsController.get(appellantProofParams)
);
router.get('/:appealNumber/lpa-proof-evidence', representationsController.get(lpaProofParams));
router.get(
	'/:appealNumber/other-party-proof-evidence',
	representationsController.get(otherPartyProofParams)
);

router.get(
	'/:appealNumber/interested-party-comments',
	representationsController.get(interestedPartyParams)
);

router.get('/:appealNumber/planning-obligation', planningObligationDetailsController.get());

module.exports = router;
