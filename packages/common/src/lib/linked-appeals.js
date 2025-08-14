const { APPEAL_LINKED_CASE_STATUS } = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import('../../../forms-web-app/src/lib/dashboard-functions').LinkedCaseDetails} LinkedCaseDetails
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @returns {LinkedCaseDetails | null} linkedCaseDetails if appeal is linked, including linked role ie 'lead', 'child'
 */

const formatDashboardLinkedCaseDetails = (caseData) => {
	const { linkedCases } = caseData;

	if (!linkedCases || !linkedCases.length) return null;

	const leadCaseReference = linkedCases[0].leadCaseReference;

	const linkedCaseStatus =
		leadCaseReference === caseData.caseReference
			? APPEAL_LINKED_CASE_STATUS.LEAD
			: APPEAL_LINKED_CASE_STATUS.CHILD;

	return {
		linkedCaseStatus,
		leadCaseReference,
		linkedCaseStatusLabel: mapLinkedCaseStatusLabel(linkedCaseStatus)
	};
};

/**
 * Map an linked case status to it's corresponding tag text
 *
 * @param {string|undefined} status
 * @returns {string | null | undefined}
 */
const mapLinkedCaseStatusLabel = (status) => {
	if (!status) return null;

	const labels = {
		[APPEAL_LINKED_CASE_STATUS.CHILD]: 'Child',
		[APPEAL_LINKED_CASE_STATUS.LEAD]: 'Lead'
	};

	return labels[status];
};

/**
 * check whether case is a child linked case
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isChildLinkedAppeal = (appealCaseData) =>
	appealCaseData.linkedCases?.[0].childCaseReference === appealCaseData.caseReference;

module.exports = {
	formatDashboardLinkedCaseDetails,
	mapLinkedCaseStatusLabel,
	isChildLinkedAppeal
};
