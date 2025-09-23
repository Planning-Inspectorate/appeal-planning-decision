/**
 * @typedef {import('@pins/dynamic-forms/src/journey').Journey} Journey
 * @typedef {import('@pins/dynamic-forms/src/section').Section} Section
 */

/**
 * @param {string} fieldName
 * @param {Journey} journey
 * @param {Section} section
 * @returns {string | undefined} url if set otherwise defaults to fieldname
 */
exports.createAppealSiteGridReferenceLink = (fieldName, journey, section) => {
	if (fieldName !== 'siteAddress' && fieldName !== 'gridReference') return undefined;
	if (fieldName === 'siteAddress') {
		return journey
			.getCurrentQuestionUrl(section.segment, fieldName)
			.replace('appeal-site-address', 'grid-reference');
	}
	if (fieldName === 'gridReference') {
		return journey
			.getCurrentQuestionUrl(section.segment, fieldName)
			.replace('grid-reference', 'appeal-site-address');
	}
};
