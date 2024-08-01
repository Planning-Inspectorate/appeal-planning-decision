const {
	checkInterestedPartySessionCaseReferenceSet,
	checkIfInterestedPartySessionSubmitted
} = require('../../services/interested-party.service');
const logger = require('../../lib/logger');

const {
	VIEW: {
		INTERESTED_PARTY_COMMENTS: { ENTER_APPEAL_REFERENCE }
	}
} = require('../../lib/views');

/**
 * @type {import('express').Handler}
 */
const checkInterestedPartySessionActive = (req, res, next) => {
	if (
		checkInterestedPartySessionCaseReferenceSet(req) &&
		!checkIfInterestedPartySessionSubmitted(req)
	) {
		return next();
	}

	logger.info('Interested party case reference not set or appeal already submitted');

	return res.redirect(`/${ENTER_APPEAL_REFERENCE}`);
};

module.exports = checkInterestedPartySessionActive;
