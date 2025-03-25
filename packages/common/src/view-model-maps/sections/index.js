/** @type {(maybeSections: unknown) => maybeSections is import('./def').Sections} */
exports.isSection = (maybeSections) => !!maybeSections;

/**
 * @typedef FormattedSection
 * @property {string} heading
 * @property {Array<object>} links
 */

/**
 * @param {{
 *   caseData: import('appeals-service-api').Api.AppealCaseDetailed,
 *	 sections: import('./def').Sections,
 * }} args * @returns {FormattedSection[]}
 */
exports.formatSections = ({ sections, caseData }) => {
	return sections.map((section) => {
		const filteredLinks = section.links
			.filter(({ condition }) => condition(caseData))
			.map((link) => {
				const submissionDate = link.submissionDate ? link.submissionDate.text(caseData) : null;
				return {
					...link,
					submissionDate
				};
			});

		return {
			...section,
			links: filteredLinks
		};
	});
};
