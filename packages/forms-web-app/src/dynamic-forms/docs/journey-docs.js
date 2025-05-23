let details = [];

const fs = require('fs').promises;
const path = require('path');
const { Section } = require('../section');

Section.prototype.withCondition = function (condition) {
	const lastQuestionAdded = this.questions.length - 1;
	this.questions[lastQuestionAdded].logCondition = String(condition);
	return this;
};

// todo: duplication
const appealJourneys = async () => {
	const { sections: hasSections } = require('../has-appeal-form/journey');
	const { sections: s78Sections } = require('../s78-appeal-form/journey');
	const { sections: s20Sections } = require('../s20-appeal-form/journey');
	const { sections: advertsSections } = require('../adverts-appeal-form/journey');
	const { sections: casPlanningSections } = require('../cas-planning-appeal-form/journey');

	await getJourneyDetails('has-appeal-form', hasSections);
	await getJourneyDetails('s78-appeal-form', s78Sections);
	await getJourneyDetails('s20-appeal-form', s20Sections);
	await getJourneyDetails('adverts-appeal-form', advertsSections);
	await getJourneyDetails('cas-planning-appeal-form', casPlanningSections);
};

const lpaqJourneys = async () => {
	const { sections: hasSections } = require('../has-questionnaire/journey');
	const { sections: s78Sections } = require('../s78-questionnaire/journey');
	const { sections: s20Sections } = require('../s20-lpa-questionnaire/journey');
	const { sections: advertsSections } = require('../adverts-questionnaire/journey');
	const { sections: casPlanningSections } = require('../cas-planning-questionnaire/journey');

	await getJourneyDetails('has-lpaq', hasSections);
	await getJourneyDetails('s78-lpaq', s78Sections);
	await getJourneyDetails('s20-lpaq', s20Sections);
	await getJourneyDetails('adverts-lpaq', advertsSections);
	await getJourneyDetails('cas-planning-lpaq', casPlanningSections);
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
