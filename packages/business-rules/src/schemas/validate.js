const householderAppeal = require('./householder-appeal');
const fullAppeal = require('./full-appeal');
const isValid = require('../validation/appeal/type/is-valid');
const { APPEAL_ID } = require('../constants');
const BusinessRulesError = require('../lib/business-rules-error');

const validate = (action, data, config = { abortEarly: false }) => {
	const { appealType } = data;

	if (appealType && !isValid(appealType)) {
		throw new BusinessRulesError(`${appealType} is not a valid appeal type`);
	}

	switch (appealType) {
		case APPEAL_ID.HOUSEHOLDER:
			return householderAppeal[action].validate(data, config);
		case APPEAL_ID.PLANNING_SECTION_78:
		case APPEAL_ID.PLANNING_LISTED_BUILDING:
		case APPEAL_ID.MINOR_COMMERCIAL:
		case APPEAL_ID.ADVERTISEMENT:
			// listed building and MINOR_COMMERCIAL appeal is v2 only - we use
			// full appeal validator here for BYS validation
			return fullAppeal[action].validate(data, config);
		default:
			return data;
	}
};

const insert = (data, config) => validate('insert', data, config);
const update = (data, config) => validate('update', data, config);

module.exports = {
	insert,
	update,
	validate
};
