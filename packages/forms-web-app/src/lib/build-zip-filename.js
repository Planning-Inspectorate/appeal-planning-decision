/**
 * @param {string} appealNumber
 * @param {string} [appealCaseStage]
 * @returns {string}
 */
const buildZipFilename = (appealNumber, appealCaseStage) => {
	const timestampTokens = new Date().toISOString().split('T');
	const dateString = timestampTokens[0].replaceAll('-', '');
	const timeString = timestampTokens[1].split('.')[0].replaceAll(':', '');
	const caseStage = appealCaseStage ? `_${appealCaseStage}` : '';
	return `appeal_${appealNumber}${caseStage}_${dateString}${timeString}.zip`;
};

module.exports = buildZipFilename;
