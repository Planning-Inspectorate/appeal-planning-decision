let details = [];

const fs = require('fs').promises;
const path = require('path');
const { Section } = require('@pins/dynamic-forms/src/section');

Section.prototype.withCondition = function (condition) {
	const lastQuestionAdded = this.questions.length - 1;
	this.questions[lastQuestionAdded].logCondition = String(condition);
	return this;
};

// todo: duplication
const appealJourneys = async () => {
	const { makeSections: hasSections } = require('../has-appeal-form/journey');
	const { makeSections: s78Sections } = require('../s78-appeal-form/journey');
	const { makeSections: s20Sections } = require('../s20-appeal-form/journey');
	const { makeSections: advertsSections } = require('../adverts-appeal-form/journey');
	const { makeSections: casPlanningSections } = require('../cas-planning-appeal-form/journey');

	await getJourneyDetails(
		'has-appeal-form',
		hasSections({
			journeyId: 'has-appeal-form',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		's78-appeal-form',
		s78Sections({
			journeyId: 's78-appeal-form',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		's20-appeal-form',
		s20Sections({
			journeyId: 's20-appeal-form',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);

	await getJourneyDetails(
		'adverts-appeal-form',
		advertsSections({
			journeyId: 'adverts-appeal-form',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		'cas-planning-appeal-form',
		casPlanningSections({
			journeyId: 'cas-planning-appeal-form',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
};

const lpaqJourneys = async () => {
	const { makeSections: hasSections } = require('../has-questionnaire/journey');
	const { makeSections: s78Sections } = require('../s78-questionnaire/journey');
	const { makeSections: s20Sections } = require('../s20-lpa-questionnaire/journey');
	const {
		casAdverts: { makeSections: casAdvertsSections },
		adverts: { makeSections: advertsSections }
	} = require('../adverts-questionnaire/journey');
	const { makeSections: casPlanningSections } = require('../cas-planning-questionnaire/journey');

	await getJourneyDetails(
		'has-lpaq',
		hasSections({
			journeyId: 'has-questionnaire',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		's78-lpaq',
		s78Sections({
			journeyId: 's78-questionnaire',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		's20-lpaq',
		s20Sections({
			journeyId: 's20-questionnaire',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		'adverts-lpaq',
		advertsSections({
			journeyId: 'adverts-questionnaire',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		'cas-adverts-lpaq',
		casAdvertsSections({
			journeyId: 'cas-adverts-questionnaire',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		'cas-planning-lpaq',
		casPlanningSections({
			journeyId: 'cas-planning-questionnaire',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
};

/**
 * @param {string} name
 * @param {Section[]} sections
 */
const getJourneyDetails = async (name, sections) => {
	details = [];
	const outputFile = name + '-journey.md';
	const filePath = path.join(__dirname, outputFile);

	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, '');

	details.push(`# ${name}`);
	sections.forEach((section) => {
		details.push(`\n## ${section.name}\n`);
		section.questions.forEach((question) => {
			details.push(`- ${question.viewFolder} \`/${question.getUrlSlug()}/\` ${question.question}`);
			if (question.logCondition) {
				details.push(
					`\`\`\`js\n condition: ${question.logCondition.replace(/\s+/g, ' ').trim()}\n\`\`\``
				);
			}
		});
	});

	const content = details.join('\n') + '\n';

	await fs.appendFile(filePath, content);
};

const run = async () => {
	await appealJourneys();
	await lpaqJourneys();
};

run().catch(console.error);
