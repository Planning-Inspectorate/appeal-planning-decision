let details = [];

const fs = require('fs').promises;
const path = require('path');
const { Section } = require('@pins/dynamic-forms/src/section');

const originalAddQuestion = Section.prototype.addQuestion;
const originalAddQuestions = Section.prototype.addQuestions;

const addMultiConditionMetadata = (question, conditionName, condition, isStart) => {
	if (isStart) {
		question.logMultiConditionName = `\n - Multiquestion condition started: ${conditionName}\n`;
		question.logMultiCondition = String(condition);
		return;
	}

	question.logMultiConditionName = `\n - Multiquestion condition ended: ${conditionName}\n`;
};

const attachPendingMultiCondition = (section) => {
	if (!section.pendingMultiQuestionCondition) {
		return;
	}

	const question = section.questions[section.questions.length - 1];
	if (!question) {
		return;
	}

	const { conditionName, condition } = section.pendingMultiQuestionCondition;
	addMultiConditionMetadata(question, conditionName, condition, true);
	section.pendingMultiQuestionCondition = undefined;
};

Section.prototype.addQuestion = function (...args) {
	const result = originalAddQuestion.apply(this, args);
	attachPendingMultiCondition(this);
	return result;
};

Section.prototype.addQuestions = function (...args) {
	const result = originalAddQuestions.apply(this, args);
	attachPendingMultiCondition(this);
	return result;
};

Section.prototype.withCondition = function (condition) {
	const lastQuestionAdded = this.questions.length - 1;
	this.questions[lastQuestionAdded].logCondition = String(condition);
	return this;
};

Section.prototype.startMultiQuestionCondition = function (conditionName, condition) {
	const lastQuestionAdded = this.questions.length - 1;
	if (lastQuestionAdded >= 0) {
		addMultiConditionMetadata(this.questions[lastQuestionAdded], conditionName, condition, true);
		return this;
	}

	this.pendingMultiQuestionCondition = { conditionName, condition };
	return this;
};

Section.prototype.endMultiQuestionCondition = function (conditionName) {
	const lastQuestionAdded = this.questions.length - 1;
	if (lastQuestionAdded < 0) {
		return this;
	}

	addMultiConditionMetadata(this.questions[lastQuestionAdded], conditionName, undefined, false);
	return this;
};

// todo: duplication
const appealJourneys = async () => {
	const { makeSections: hasSections } = require('../has-appeal-form/journey');
	const { makeSections: s78Sections } = require('../s78-appeal-form/journey');
	const { makeSections: s20Sections } = require('../s20-appeal-form/journey');
	const { makeSections: advertsSections } = require('../adverts-appeal-form/journey');
	const { makeSections: casPlanningSections } = require('../cas-planning-appeal-form/journey');
	const { makeSections: enforcementSections } = require('../enforcement-appeal-form/journey');
	const {
		makeSections: enforcementListedSections
	} = require('../enforcement-listed-appeal-form/journey');
	const { makeSections: ldcSections } = require('../ldc-appeal-form/journey');

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
	await getJourneyDetails(
		'enforcement-appeal-form',
		enforcementSections({
			journeyId: 'enforcement-appeal-form',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		'enforcement-listed-appeal-form',
		enforcementListedSections({
			journeyId: 'enforcement-listed-appeal-form',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		'ldc-appeal-form',
		ldcSections({
			journeyId: 'ldc-appeal-form',
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
	const { makeSections: enforcementSections } = require('../enforcement-questionnaire/journey');
	const {
		makeSections: enforcementListedSections
	} = require('../enforcement-listed-questionnaire/journey');
	const { makeSections: ldcSections } = require('../ldc-questionnaire/journey');

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
	await getJourneyDetails(
		'enforcement-lpaq',
		enforcementSections({
			journeyId: 'enforcement-questionnaire',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		'enforcement-listed-lpaq',
		enforcementListedSections({
			journeyId: 'enforcement-listed-questionnaire',
			LPACode: 'Q9999',
			referenceId: '123',
			answers: {}
		})
	);
	await getJourneyDetails(
		'ldc-lpaq',
		ldcSections({
			journeyId: 'ldc-questionnaire',
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
			if (question.logMultiConditionName) {
				details.push(question.logMultiConditionName);
			}
			if (question.logMultiCondition) {
				details.push(
					`\`\`\`js\n condition: ${question.logMultiCondition.replace(/\s+/g, ' ').trim()}\n\`\`\``
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
