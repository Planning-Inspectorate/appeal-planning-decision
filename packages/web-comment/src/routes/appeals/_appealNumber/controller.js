const { getAppealStatus } = require('#utils/appeal-status');
const { apiClient } = require('#utils/appeals-api-client');
const { formatHeadlineData } = require('@pins/common');

const selectedAppeal = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	const appeal = await apiClient.getAppealCaseByCaseRef(appealNumber);

	const headlineData = formatHeadlineData(appeal);

	res.render(`appeals/_appealNumber/index`, {
		appeal: { ...appeal, status: getAppealStatus(appeal) },
		headlineData
	});
};

module.exports = { selectedAppeal };
