const {
	VIEW: {
		BEFORE_YOU_START: { APPLICATION_LOOKUP_FAILED }
	}
} = require('../../lib/views');

const confirmInputName = 'confirm-application-number';
const typeOfApplicationUrl = '/before-you-start/type-of-planning-application';
const applicationLookupUrl = '/before-you-start/application-number';

const getApplicationFailedLookup = async (req, res) => {
	const { appeal } = req.session;

	res.render(APPLICATION_LOOKUP_FAILED, {
		planningApplicationNumber: appeal.planningApplicationNumber
	});
};

const postApplicationFailedLookup = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	let { appeal } = req.session;

	const confirmApplicationNumber = body[confirmInputName];

	if (errors[confirmInputName]) {
		return res.render(APPLICATION_LOOKUP_FAILED, {
			confirmApplicationNumber,
			planningApplicationNumber: appeal.planningApplicationNumber,
			errors,
			errorSummary
		});
	}

	if (confirmApplicationNumber === 'yes') {
		return res.redirect(typeOfApplicationUrl);
	}

	return res.redirect(applicationLookupUrl);
};

module.exports = {
	getApplicationFailedLookup,
	postApplicationFailedLookup
};
