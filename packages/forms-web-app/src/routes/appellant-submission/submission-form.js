const express = require('express');
const {
	list,
	question,
	save,
	remove,
	appellantSubmissionDeclaration,
	appellantSubmissionInformation,
	appellantSubmitted,
	submitAppellantSubmission,
	appellantBYSListOfDocuments,
	appellantStartAppeal
} = require('../../dynamic-forms/controller');
const validate = require('@pins/dynamic-forms/src/validator/validator');
const {
	validationErrorHandler
} = require('@pins/dynamic-forms/src/validator/validation-error-handler');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-appellant');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { businessRulesDeadline } = require('../../lib/calculate-deadline');
const { mapTypeCodeToAppealId } = require('@pins/common');
const { format } = require('date-fns');
const { caseTypeLookup } = require('@pins/common/src/database/data-static');

const { getJourney } = require('../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../journeys');
const checkDecisionDateDeadline = require('../../middleware/check-decision-date-deadline');
const checkAppealExists = require('../../middleware/check-appeal-exists');

const {
	VIEW: {
		APPEALS: { YOUR_APPEALS }
	}
} = require('#lib/views');
const config = require('../../config');

const dashboardUrl = `/${YOUR_APPEALS}`;

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const appellantSubmissionTaskList = async (req, res) => {
	req.appealsApiClient;
	const journey = res.locals.journey;

	const appealType = journey.response.answers.appealTypeCode;

	const deadline = businessRulesDeadline(
		journey.response.answers.applicationDecisionDate,
		mapTypeCodeToAppealId(appealType),
		null,
		true
	);
	const formattedDeadline = format(deadline, 'dd MMM yyyy');

	const caseType = caseTypeLookup(appealType, 'processCode');
	if (!caseType) throw new Error(`Appeal type ${appealType} does not exist`);

	const declarationUrl = `/appeals/${caseType.friendlyUrl}/submit/declaration?id=${journey.response.referenceId}`;

	return list(req, res, `${caseType.type} Appeal`, {
		declarationUrl,
		formattedDeadline,
		navigation: ['', dashboardUrl],
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(caseType.processCode))
	});
};

router.get(
	'/appeal-form/before-you-start',
	checkAppealExists,
	checkDecisionDateDeadline,
	appellantBYSListOfDocuments
);

router.post(
	'/appeal-form/before-you-start',
	checkAppealExists,
	checkDecisionDateDeadline,
	appellantStartAppeal
);

router.get(
	'/appeal-form/your-appeal',
	getJourneyResponse,
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	appellantSubmissionTaskList
);

router.get(
	'/submit/declaration',
	getJourneyResponse,
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	appellantSubmissionDeclaration
);

router.post(
	'/submit/declaration',
	getJourneyResponse,
	getJourney(journeys),
	validationErrorHandler,
	submitAppellantSubmission
);

router.get(
	'/submit/information',
	getJourneyResponse,
	getJourney(journeys),
	appellantSubmissionInformation
);

router.get(
	'/submit/submitted',
	getJourneyResponse,
	getJourney(journeys),
	validationErrorHandler,
	appellantSubmitted
);

// question
router.get(
	'/:section/:question',
	getJourneyResponse,
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	question
);

// save
router.post(
	'/:section/:question',
	getJourneyResponse,
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// remove answer - only available for some question types
router.get(
	'/:section/:question/:answerId',
	getJourneyResponse,
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	remove
);

module.exports = router;
