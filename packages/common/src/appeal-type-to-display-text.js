/**
 *
 * @param {Object<string, CASE_TYPE>} appealType
 * @returns {string}
 */
const mapAppealTypeToDisplayText = (appealType) => {
	return appealType?.type?.toLowerCase().replace('cas', 'CAS');
};

/**
 *
 * @param {Object<string, CASE_TYPE>} appealType
 * @returns {string}
 */
const mapAppealTypeToDisplayTextWithAnOrA = (appealType) => {
	const appealTypeDisplayText = mapAppealTypeToDisplayText(appealType);
	return appealTypeDisplayText === 'advertisement' || appealTypeDisplayText === 'enforcement notice'
		? 'an ' + appealTypeDisplayText
		: 'a ' + appealTypeDisplayText;
};

module.exports = { mapAppealTypeToDisplayText, mapAppealTypeToDisplayTextWithAnOrA };
