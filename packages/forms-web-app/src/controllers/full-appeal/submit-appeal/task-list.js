const { FULL_APPEAL_SECTIONS } = require('../../../services/task.service');
const { VIEW } = require('../../../lib/full-appeal/views');
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

	// block appeals that have not completed before you start
	if (appeal?.hideFromDashboard) {
		throw new Error(`Appeal ${appeal._id} has not completed before you start`);
	}

	const sections = buildTaskLists(appeal);

	const applicationStatus = 'Appeal incomplete';

	const sectionInfo = countTasks(sections);

	res.render(VIEW.FULL_APPEAL.TASK_LIST, {
		applicationStatus,
		sectionInfo,
		sections
	});
};
