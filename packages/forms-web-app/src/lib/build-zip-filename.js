const buildZipFilename = (appealNumber, appealCaseStage) => {
	const timestampTokens = new Date().toISOString().split('T');
	const dateString = timestampTokens[0].replaceAll('-', '');
	const timeString = timestampTokens[1].split('.')[0].replaceAll(':', '');
	return `appeal_${appealNumber}_${appealCaseStage}_${dateString}${timeString}.zip`;
};

module.exports = buildZipFilename;
