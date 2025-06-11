const express = require('express');
const {
	list,
	question,
	save,
	submitLpaFinalComment,
	lpaFinalCommentSubmitted,
	startJourneyFromBeginning
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-lpa-final-comments');
const { getJourney } = require('../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../journeys');
const setDefaultSection = require('../../dynamic-forms/middleware/set-default-section');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');

const { getUserFromSession } = require('../../services/user.service');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('pins-data-model');

const {
	VIEW: {
		LPA_DASHBOARD: { APPEAL_OVERVIEW }
	}
} = require('#lib/views');

const appealOverviewUrl = APPEAL_OVERVIEW;

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const lpaFinalCommentTaskList = async (req, res) => {
	const referenceId = res.locals.journeyResponse.referenceId;
	const user = getUserFromSession(req);
	const encodedReferenceId = encodeURIComponent(referenceId);
	const appeal = await req.appealsApiClient.getUsersAppealCase({
		caseReference: encodedReferenceId,
		userId: user.id,
		role: LPA_USER_ROLE
	});

	appeal.appealTypeName = caseTypeNameWithDefault(appeal.appealTypeCode);
	const appellant = appeal.users.find((x) => x.serviceUserType === SERVICE_USER_TYPE.APPELLANT);
	if (appellant) {
		appeal.appellantFirstName = appellant.firstName;
		appeal.appellantLastName = appellant.lastName;
	}

	const pageCaption = `Appeal ${appeal.caseReference}`;

	return list(req, res, pageCaption, { appeal });
};

// list
router.get(
	'/final-comments/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	lpaFinalCommentTaskList
);

// entry
/** @type {import('express').RequestHandler} */
router.get(
	'/final-comments/:referenceId/entry',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	startJourneyFromBeginning
);

// submit
router.post(
	'/final-comments/:referenceId/',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	validationErrorHandler,
	submitLpaFinalComment
);

router.get(
	'/final-comments/:referenceId/submitted',
	getJourneyResponse(false),
	getJourney(journeys),
	validationErrorHandler,
	lpaFinalCommentSubmitted
);

// question
router.get(
	'/final-comments/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	question
);

// save
router.post(
	'/final-comments/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

module.exports = router;
