const logger = require('../../lib/logger');
const {
	VIEW: {
		BEFORE_YOU_START: { APPLICATION_LOOKUP, APPLICATION_LOOKUP_FAILED }
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
const canUseServicePage = '/before-you-start/can-use-service';

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

	let allDataRetrieved = false;
	let lookupResult;
	try {
		const bopsClient = new BopsApiClient(bopsAPIBaseUrl, allowTestingOverrides);
		lookupResult = await bopsClient.getPublicApplication(planningApplicationNumber);
		// todo: ad-45 add loading screen while we wait for api response
	} catch {
		logger.debug('failed application lookup asking user to confirm');
		// save application number to appeal and ask them to confirm if request fails for any reason
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return res.redirect(`/${APPLICATION_LOOKUP_FAILED}`);
	}

	try {
		// todo: map address and add to buildCreateAppellantSubmissionData
		const mappedLookupData = mapBopsBeforeYouStart(lookupResult);
		if (mappedLookupData) {
			appeal.appealType = mappedLookupData.appealType;
			appeal.eligibility.applicationDecision = mappedLookupData.eligibility.applicationDecision;
			appeal.typeOfPlanningApplication = mappedLookupData.typeOfPlanningApplication;
			appeal.decisionDate = mappedLookupData.decisionDate;
			allDataRetrieved = mappedLookupData.allData;
		}

		req.session.appeal = await createOrUpdateAppeal(appeal);

		if (allDataRetrieved) {
			return res.redirect(canUseServicePage);
		}
	} catch (err) {
		logger.error(err, 'Could not create or update appeal after application lookup');
		return res.render(APPLICATION_LOOKUP, {
			planningApplicationNumber,
			errors,
			errorSummary: [{ text: 'There was a problem', href: '#' }]
		});
	}

	return res.redirect(typeOfApplicationPage);
};

module.exports = {
	getApplicationLookup,
	postApplicationLookup
};
