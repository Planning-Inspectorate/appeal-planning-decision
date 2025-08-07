const { APPEAL_LINKED_CASE_STATUS } = require('@planning-inspectorate/data-model');

/**
 * Map an linked case status to it's corresponding tag text
 *
 * @param {string|undefined} status
 * @returns {string | null}
 */
const mapLinkedCaseStatusLabel = (status) => {
	if (!status) return null;

	const labels = {
		[APPEAL_LINKED_CASE_STATUS.CHILD]: 'Child',
		[APPEAL_LINKED_CASE_STATUS.LEAD]: 'Lead'
	};

	return labels[status];
};

module.exports = {
	mapLinkedCaseStatusLabel
};
