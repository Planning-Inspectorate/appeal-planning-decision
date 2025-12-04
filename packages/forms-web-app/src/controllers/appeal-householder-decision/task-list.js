const { getTaskStatus, SECTIONS } = require('../../services/task.service');
const { VIEW } = require('../../lib/views');
const countTasks = require('../../lib/count-task');

const HEADERS = {
	aboutYouSection: 'About you',
	yourDetails: 'Your details',
	requiredDocumentsSection: 'About the original planning application',
	originalApplication: 'Upload the original planning application form',
	decisionLetter: 'Upload the decision letter',
	dateApplied: 'Date you applied for planning permission',
	yourAppealSection: 'About your appeal',
	appealStatement: 'Your appeal statement',
	otherDocuments: 'Any other documents to support your appeal',
	appealSiteSection: 'Visiting the appeal site',
	siteAddress: 'Address of the appeal site',
	siteAccess: 'Access to the appeal site',
	siteOwnership: 'Ownership of the appeal site',
	healthAndSafety: 'Any health and safety issues',
	submitYourAppealSection: 'Submit your appeal',
	checkYourAnswers: 'Check your answers'
};

function buildTaskLists(appeal) {
	const taskList = [];
	const sections = SECTIONS;
	Object.keys(sections).forEach((sectionName) => {
		const section = sections[sectionName];

		const task = {
			heading: {
				text: HEADERS[sectionName]
			},
			items: []
		};

		Object.keys(section).forEach((subSectionName) => {
			const subSection = section[subSectionName];

			const status = getTaskStatus(appeal, sectionName, subSectionName);

			task.items.push({
				text: HEADERS[subSectionName],
				href: subSection.href,
				attributes: {
					name: subSectionName,
					[`${subSectionName}-status`]: status
				},
				status
			});
		});
		taskList.push(task);
	});
	return taskList;
}

exports.getTaskList = (req, res) => {
	const { appeal } = req.session;

	// block appeals that have not completed before you start
	if (appeal?.hideFromDashboard) {
		throw new Error(`Appeal ${appeal._id} has not completed before you start`);
	}

	const sections = buildTaskLists(appeal);

	const applicationStatus = 'Application incomplete';

	const sectionInfo = countTasks(sections);

	res.render(VIEW.APPELLANT_SUBMISSION.TASK_LIST, {
		applicationStatus,
		sectionInfo,
		sections
	});
};
