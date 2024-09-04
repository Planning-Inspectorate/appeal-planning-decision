const express = require('express');
const {
	list,
	question,
	save
	// remove,
	// submit,
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-lpa-statement');
const setDefaultSection = require('../../dynamic-forms/middleware/set-default-section');
const redirectToUnansweredQuestion = require('../../dynamic-forms/middleware/redirect-to-unanswered-question');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');

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
const finalCommentsTaskList = async (req, res) => {
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
	redirectToUnansweredQuestion(),
	checkNotSubmitted(dashboardUrl),
	finalCommentsTaskList
);

// question
router.get(
	'/final-comments/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	checkNotSubmitted(dashboardUrl),
	question
);

// save
router.post(
	'/final-comments/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	checkNotSubmitted(dashboardUrl),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// submit
// router.post(
// 	'/appeal-statement/:referenceId/',
// 	getJourneyResponse(),
// 	checkNotSubmitted(dashboardUrl),
// 	validationErrorHandler,
// 	submit
// );

// // remove answer - only available for some question types
// router.get(
// 	'/appeal-statement/:referenceId/:section/:question/:answerId',
// 	getJourneyResponse(),
// 	checkNotSubmitted(dashboardUrl),
// 	remove
// );

module.exports = router;
