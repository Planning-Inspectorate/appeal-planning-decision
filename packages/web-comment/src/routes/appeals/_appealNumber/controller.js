const { getAppealStatus } = require('#utils/appeal-status');
const { apiClient } = require('#utils/appeals-api-client');
const { formatHeadlineData } = require('@pins/common');

const selectedAppeal = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	// TODO update to a new endpoint
	// this API doesn't really satisfy the spec of AAPD-1247
	// but I think we should move forward with this to get
	// this code merged, then create a new endpoint and hook
	// it up in a later iteration.
	const appeal = await apiClient.getAppealCaseDataByCaseReference(appealNumber);

	const headlineData = formatHeadlineData(appeal);

	res.render(`appeals/_appealNumber/index`, {
		appeal: { ...appeal, status: getAppealStatus(appeal) },
		headlineData
	});
};

module.exports = { selectedAppeal };
