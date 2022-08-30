const { FULL_APPEAL_SECTIONS } = require('../../../services/task.service');
const {
	VIEW: { TASK_LIST }
} = require('../../../lib/views');
const { getHref } = require('../../../lib/get-route-for-special-cases');

const HEADERS = {
	contactDetailsSection: 'Provide your contact details',
	appealSiteSection: 'Tell us about the appeal site',
	appealDecisionSection: 'Tell us how you would prefer us to decide your appeal',
	planningApplicationDocumentsSection: 'Upload documents from your planning application',
	appealDocumentsSection: 'Upload documents for your appeal',
	submitYourAppealSection: 'Check your answers and submit your appeal'
};

function buildTaskLists(appeal) {
	const taskList = [];
	const { ...sections } = FULL_APPEAL_SECTIONS;

	Object.keys(sections).forEach((sectionName) => {
		const section = sections[sectionName];

		const status = section.rule(appeal);

		taskList.push({
			text: HEADERS[sectionName],
			href: getHref(appeal, sectionName, section),
			attributes: {
				name: sectionName,
				[`${sectionName}-status`]: status
			},
			status
		});
	});

	return taskList;
}

function countTasks(sections) {
	const nbTasks = sections.length;
	const nbCompleted = sections.filter((section) => section.status === 'COMPLETED').length;

	return {
		nbTasks,
		nbCompleted
	};
}

exports.getTaskList = (req, res) => {
	const { appeal } = req.session;

	const sections = buildTaskLists(appeal);

	const applicationStatus = 'Appeal incomplete';

	const sectionInfo = countTasks(sections);

	res.render(TASK_LIST, {
		appeal,
		applicationStatus,
		sectionInfo,
		sections
	});
};
