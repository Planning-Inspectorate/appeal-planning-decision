const express = require('express');

const selectedAppealController = require('../../../controllers/selected-appeal');
const appealDetailsController = require('../../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../../controllers/selected-appeal/questionnaire-details');
const planningObligationDetailsController = require('../../../controllers/selected-appeal/planning-obligation-details');
const downloadDocumentsController = require('../../../controllers/selected-appeal/downloads/documents');

const representationsController = require('../../../controllers/selected-appeal/representations');
const {
	LPA_USER_ROLE,
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');

const router = express.Router({ mergeParams: true });

const userType = APPEAL_USER_ROLES.APPELLANT;

const lpaStatementParams = {
	userType,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	submittingParty: LPA_USER_ROLE
};

const rule6StatementParams = {
	userType,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
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

const rule6ProofParams = {
	userType,
	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
	submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
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
router.get(
	'/:appealNumber/other-party-statements',
	representationsController.get(rule6StatementParams)
);

router.get(
	'/:appealNumber/final-comments',
	representationsController.get(appellantFinalCommentParams)
);
router.get(
	'/:appealNumber/lpa-final-comments',
	representationsController.get(lpaFinalCommentParams)
);

router.get('/:appealNumber/proof-evidence', representationsController.get(appellantProofParams));
router.get('/:appealNumber/lpa-proof-evidence', representationsController.get(lpaProofParams));
router.get(
	'/:appealNumber/other-party-proof-evidence',
	representationsController.get(rule6ProofParams)
);

router.get(
	'/:appealNumber/interested-party-comments',
	representationsController.get(interestedPartyParams)
);

router.get('/:appealNumber/planning-obligation', planningObligationDetailsController.get());

router.get(
	`/:appealNumber/download/:documentsLocation/documents/:appealCaseStage`,
	downloadDocumentsController.get()
);

module.exports = router;
