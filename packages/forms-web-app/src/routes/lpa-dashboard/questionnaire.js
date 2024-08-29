const express = require('express');
const {
	list,
	question,
	save,
	remove,
	submit,
	lpaSubmitted
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-lpa');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');
const { getJourney } = require('../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../journeys');

const { getUserFromSession } = require('../../services/user.service');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('pins-data-model');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD }
	}
} = require('#lib/views');
const dashboardUrl = `/${DASHBOARD}`;

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const questionnaireTaskList = async (req, res) => {
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

	const backOverride = {
		text: 'Return to your appeals',
		href: '/manage-appeals/your-appeals'
	};

	return list(req, res, pageCaption, { appeal, backOverride });
};

// list
router.get(
	'/questionnaire/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	questionnaireTaskList
);

// question
router.get(
	'/questionnaire/:referenceId/:section/:question',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	question
);

// save
router.post(
	'/questionnaire/:referenceId/:section/:question',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// submit
router.post(
	'/questionnaire/:referenceId/',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	validationErrorHandler,
	submit
);

router.get(
	'/full-planning/:referenceId/questionnaire-submitted',
	getJourneyResponse(),
	getJourney(journeys),
	validationErrorHandler,
	lpaSubmitted
);

router.get(
	'/householder/:referenceId/questionnaire-submitted',
	getJourneyResponse(),
	getJourney(journeys),
	validationErrorHandler,
	lpaSubmitted
);

// remove answer - only available for some question types
router.get(
	'/questionnaire/:referenceId/:section/:question/:answerId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	remove
);

module.exports = router;
