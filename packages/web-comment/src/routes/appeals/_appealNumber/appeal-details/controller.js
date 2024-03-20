const { getAppealStatus } = require('#utils/appeal-status');
const { formatDeadlineText } = require('#utils/format-deadline-text');
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
const appealDetails = async (req, res) => {
	const appealNumber = req.params.appealNumber;

	const appeal = await apiClient.getAppealCaseByCaseRef(appealNumber);

	const headlineData = formatHeadlineData(appeal);

	const status = getAppealStatus(appeal);

	const deadlineText = formatDeadlineText(appeal, status);

	res.render(`appeals/_appealNumber/appeal-details/index`, {
		appeal: {
			...appeal,
			status,
			sections: formatSections({
				caseData: appeal,
				sections: sections
			}),
			deadlineText
		},
		headlineData
	});
};

module.exports = { appealDetails };
