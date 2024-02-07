const { VIEW } = require('../../lib/views');
const { apiClient } = require('../../lib/appeals-api-client');

exports.get = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	const caseData = await apiClient.getAppealCaseDataByCaseReference(appealNumber);

	// type
	// procedure
	// site
	// applicant
	// application number

	const viewContext = {
		appeal: {
			appealNumber: appealNumber,
			appealType: caseData[0].appealTypeName
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
