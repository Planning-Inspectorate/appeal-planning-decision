/**
 * @typedef {Object} InterestedParty
 * @property {string} caseReference
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [emailAddress]
 * @property {string} [addressLine1]
 * @property {string} [addressLine2]
 * @property {string} [townCity]
 * @property {string} [county]
 * @property {string} [postcode]
 * @property {string} [comments]
 * @property {boolean} [submitted]
 */

/**
 * Adds InterestedParty to req.session
 * @param {import('express').Request} req
 * @param {string} caseReference
 */
const createInterestedPartySession = (req, caseReference) => {
	/** @type {InterestedParty} */
	req.session.interestedParty = {
		caseReference
	};
};

/**
 * Adds InterestedParty to req.session
 * @param {import('express').Request} req
 * @param {Object} updatedFields
 * @returns {InterestedParty} updated interested party
 */
const updateInterestedPartySession = (req, updatedFields) => {
	/** @type {InterestedParty} */
	req.session.interestedParty = {
		...req.session.interestedParty,
		...updatedFields
	};

	return req.session.interestedParty;
};

/**
 * retrieves the interested party from session
 * @param {import('express').Request} req
 * @returns {InterestedParty} interested party
 */
const getInterestedPartyFromSession = (req) => {
	return req.session.interestedParty;
};

/**
 * resets interested party in req.session
 * @param {import('express').Request} req
 */
const resetInterestedPartySession = (req) => {
	req.session.interestedParty = {};
};

/**
 * confirms the interested party from session has caseReference set
 * @param {import('express').Request} req
 * @returns {boolean}
 */
const checkInterestedPartySessionCaseReferenceSet = (req) => {
	return !!req.session?.interestedParty?.caseReference;
};

/**
 * marks interested party from session as submitted
 * @param {import('express').Request} req
 */
const markInterestedPartySessionAsSubmitted = (req) => {
	req.session.interestedParty.submitted = true;
};

/**
 * confirms if the interested party from session has been submitted
 * @param {import('express').Request} req
 * @returns {boolean}
 */
const checkIfInterestedPartySessionSubmitted = (req) => {
	return !!req.session?.interestedParty?.submitted;
};

module.exports = {
	createInterestedPartySession,
	getInterestedPartyFromSession,
	updateInterestedPartySession,
	resetInterestedPartySession,
	checkInterestedPartySessionCaseReferenceSet,
	markInterestedPartySessionAsSubmitted,
	checkIfInterestedPartySessionSubmitted
};
