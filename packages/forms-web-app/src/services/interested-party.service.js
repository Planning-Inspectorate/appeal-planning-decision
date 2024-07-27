/**
 * @typedef {Object} InterestedParty
 * @property {string} appealNumber
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [emailAddress]
 * @property {IPAddress} [address]
 * @property {string} [comments]
 * @property {boolean} submitted
 */

/**
 * @typedef {Object} IPAddress
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} townCity
 * @property {string} county
 * @property {string} postcode
 */

/**
 * Adds InterestedParty to req.session
 * @param {import('express').Request} req
 * @param {string} appealNumber
 */
const createInterestedPartySession = (req, appealNumber) => {
	/** @type {InterestedParty} */
	req.session.interestedParty = {
		appealNumber,
		submitted: false
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
 * confirms the interested party from session has appealReference set
 * @param {import('express').Request} req
 * @returns {boolean}
 */
const confirmInterestedPartySessionAppealReference = (req) => {
	return !!req.session.interestedParty?.appealNumber;
};

/**
 * marks interested party from session as submitted
 * @param {import('express').Request} req
 */
const markInterestedPartySessionAsSubmitted = (req) => {
	req.session.interestedParty.submitted = true;
};

module.exports = {
	createInterestedPartySession,
	getInterestedPartyFromSession,
	updateInterestedPartySession,
	confirmInterestedPartySessionAppealReference,
	markInterestedPartySessionAsSubmitted
};
