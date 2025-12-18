const logger = require('../../lib/logger');
const {
	VIEW: {
		BEFORE_YOU_START: { APPLICATION_LOOKUP }
	}
} = require('../../lib/views');
const planningApplicationNumberInputName = 'application-number';
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const nextPageUrl = '/before-you-start/type-of-planning-application';

const getApplicationLookup = async (req, res) => {
	const { appeal } = req.session;

	const isApplicationLookupEnabled = await isLpaInFeatureFlag(
		appeal.lpaCode,
		FLAG.APPLICATION_API_LOOKUP
	);

	if (!isApplicationLookupEnabled) return res.redirect(nextPageUrl);

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

	try {
		appeal.planningApplicationNumber = planningApplicationNumber;
		// todo: function to map all known fields from planning application api lookup to appeal
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);
		return res.render(APPLICATION_LOOKUP, {
			planningApplicationNumber,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	// todo: create function to map next page in before you start flow
	return res.redirect(nextPageUrl);
};

module.exports = {
	getApplicationLookup,
	postApplicationLookup
};
