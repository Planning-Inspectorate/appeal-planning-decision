const { openOrClosed } = require('#utils/open-or-closed');

const selectedAppeal = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	let viewContext = {};

	// temporary data
	const appeal = {
		caseReference: appealNumber,
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealTypeCode: '',
		decision: '',
		originalCaseDecisionDate: '',
		costsAppliedForIndicator: false,
		LPAApplicationReference: '12/2323231/PLA',
		siteAddressLine1: '',
		siteAddressPostcode: ''
	};

	openOrClosed(appeal);

	viewContext = { appeal };

	res.render(`appeals/_appealNumber/index`, viewContext);
};

module.exports = { selectedAppeal };
