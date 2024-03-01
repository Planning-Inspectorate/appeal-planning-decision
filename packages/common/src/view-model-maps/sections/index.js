/** @type {(maybeSections: unknown) => maybeSections is import('./def').Sections} */
exports.isSection = (maybeSections) => !!maybeSections;

/**
 * @param {{
 *   caseData: import('appeals-service-api').Api.AppealCaseWithRule6Parties,
 *	 sections: import('./def').Sections,
 *   userEmail?: string,
 * }} args * @returns {import('./def').Sections}
 */
exports.formatSections = ({ sections, caseData, userEmail }) =>
	sections.map((section) => ({
		...section,
		links: section.links.filter(({ condition }) => condition(caseData, userEmail))
	}));
