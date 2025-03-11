/** @type {(maybeSections: unknown) => maybeSections is import('./def').Sections} */
exports.isSection = (maybeSections) => !!maybeSections;

/**
 * @param {{
 *   caseData: import('appeals-service-api').Api.AppealCaseDetailed,
 *	 sections: import('./def').Sections,
 * }} args * @returns {import('./def').Sections}
 */
exports.formatSections = ({ sections, caseData }) =>
	sections.map((section) => ({
		...section,
		links: section.links.filter(({ condition }) => condition(caseData))
	}));
