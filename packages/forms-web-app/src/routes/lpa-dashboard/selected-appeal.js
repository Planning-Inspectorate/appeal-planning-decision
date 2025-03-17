const express = require('express');
const router = express.Router({ mergeParams: true });

const {
	LPA_USER_ROLE,
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');

const selectedAppealController = require('../../controllers/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../controllers/selected-appeal/questionnaire-details');
const planningObligationDetailsController = require('../../controllers/selected-appeal/planning-obligation-details');
const downloadDocumentsController = require('../../controllers/selected-appeal/downloads/documents');
const representationsController = require('../../controllers/selected-appeal/representations');

const userType = LPA_USER_ROLE;

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

const rule6StatementParams = {
	userType,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
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

router.get('/:appealNumber', selectedAppealController.get('layouts/lpa-dashboard/main.njk'));
router.get(
	'/:appealNumber/appeal-details',
	appealDetailsController.get('layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/questionnaire',
	questionnaireDetailsController.get('layouts/lpa-dashboard/main.njk')
);
router.get(
	`/:appealNumber/download/:documentsLocation/documents/:appealCaseStage`,
	downloadDocumentsController.get()
);

router.get(
	'/:appealNumber/statement',
	representationsController.get(lpaStatementParams, 'layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/other-party-statements',
	representationsController.get(rule6StatementParams, 'layouts/lpa-dashboard/main.njk')
);

router.get(
	'/:appealNumber/final-comments',
	representationsController.get(lpaFinalCommentParams, 'layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/appellant-final-comments',
	representationsController.get(appellantFinalCommentParams, 'layouts/lpa-dashboard/main.njk')
);

router.get(
	'/:appealNumber/proof-evidence',
	representationsController.get(lpaProofParams, 'layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/appellant-proof-evidence',
	representationsController.get(appellantProofParams, 'layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/other-party-proof-evidence',
	representationsController.get(rule6ProofParams, 'layouts/lpa-dashboard/main.njk')
);

router.get(
	'/:appealNumber/interested-party-comments',
	representationsController.get(interestedPartyParams, 'layouts/lpa-dashboard/main.njk')
);

router.get(
	'/:appealNumber/appellant-planning-obligation',
	planningObligationDetailsController.get('layouts/lpa-dashboard/main.njk')
);

module.exports = router;
