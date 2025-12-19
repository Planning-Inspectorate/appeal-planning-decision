const logger = require('../../lib/logger');
const {
	VIEW: {
		BEFORE_YOU_START: { APPLICATION_LOOKUP }
	}
} = require('../../lib/views');
const planningApplicationNumberInputName = 'application-number';
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { BopsApiClient } = require('@pins/common/src/client/bops/bops-api-client');
const {
	bopsApi: { baseUrl: bopsAPIBaseUrl },
	server: { allowTestingOverrides }
} = require('../../config');
const {
	mappings: {
		bops: { beforeYouStart: mapBopsBeforeYouStart }
	}
} = require('@pins/business-rules');

const typeOfApplicationPage = '/before-you-start/type-of-planning-application';

const getApplicationLookup = async (req, res) => {
	const { appeal } = req.session;

	const isApplicationLookupEnabled = await isLpaInFeatureFlag(
		appeal.lpaCode,
		FLAG.APPLICATION_API_LOOKUP
	);

	if (!isApplicationLookupEnabled) return res.redirect(typeOfApplicationPage);

	res.render(APPLICATION_LOOKUP, {
		planningApplicationNumber: appeal.planningApplicationNumber
	});
};

const postApplicationLookup = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const planningApplicationNumber = body[planningApplicationNumberInputName];

	if (errors[planningApplicationNumberInputName]) {
		return res.render(APPLICATION_LOOKUP, {
			planningApplicationNumber,
			errors,
			errorSummary
		});
	}

	appeal.planningApplicationNumber = planningApplicationNumber;

	try {
		const bopsClient = new BopsApiClient(bopsAPIBaseUrl, allowTestingOverrides);
		const lookupResult = await bopsClient.getPublicApplication(planningApplicationNumber);
		// todo: ad-45 add loading screen while we wait for api response
		// todo: map address and add to buildCreateAppellantSubmissionData
		const mappedLookupData = mapBopsBeforeYouStart(lookupResult);
		if (mappedLookupData) {
			appeal.eligibility.applicationDecision = mappedLookupData.eligibility.applicationDecision;
			appeal.typeOfPlanningApplication = mappedLookupData.typeOfPlanningApplication;
			appeal.decisionDate = mappedLookupData.decisionDate;
		}

		// todo: ad-36 handle deadline
	} catch (err) {
		// todo: ad-42 redirect to not found page on failed call
		return res.render(APPLICATION_LOOKUP, {
			planningApplicationNumber,
			errors,
			errorSummary: [{ text: `Could not find application ${planningApplicationNumber}`, href: '#' }]
		});
	}

	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
		// todo: ad-37 if all data present jump to check your answers page
	} catch (err) {
		logger.error(err, 'Could not create or update appeal after application lookup');
		return res.render(APPLICATION_LOOKUP, {
			planningApplicationNumber,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	return res.redirect(typeOfApplicationPage);
};

module.exports = {
	getApplicationLookup,
	postApplicationLookup
};
