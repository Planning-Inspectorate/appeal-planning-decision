const createAppealSiteGridReferenceLinkUtil = require('./utils').createAppealSiteGridReferenceLink;

/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 */

/**
 * Save the answer to the question
 * @param {string} fieldName
 * @param {Journey} journey
 * @param {Section} section
 * @returns {string | undefined}
 */
const createAppealSiteGridReferenceLink = (fieldName, journey, section) => {
	return createAppealSiteGridReferenceLinkUtil(fieldName, journey, section);
};

module.exports = {
	createAppealSiteGridReferenceLink
};
