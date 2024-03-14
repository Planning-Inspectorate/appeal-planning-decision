const { getAppealStatus } = require('#utils/appeal-status');
const { apiClient } = require('#utils/appeals-api-client');
const { formatHeadlineData, formatSections } = require('@pins/common');

/** @type {import('@pins/common/src/view-model-maps/sections/def').Sections} */
const sections = [
	{
		heading: 'Appeal details',
		links: [
			{
				url: '/appeal-details',
				text: 'View appeal details',
				condition: (appeal) => appeal.casePublished
			}
		]
	}
];

/** @type {import('express').Handler} */
const selectedAppeal = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	const appeal = await apiClient.getAppealCaseByCaseRef(appealNumber);

	const headlineData = formatHeadlineData(appeal);

	res.render(`appeals/_appealNumber/index`, {
		appeal: {
			...appeal,
			status: getAppealStatus(appeal),
			sections: formatSections({
				caseData: appeal,
				sections: sections
			})
		},
		headlineData
	});
};

module.exports = { selectedAppeal };
