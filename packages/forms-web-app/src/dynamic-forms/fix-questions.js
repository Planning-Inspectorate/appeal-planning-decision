const { questions } = require('./questions');
const fs = require('fs');
const path = require('path');

/**
 * @type {[string[], 'a-d'|'e-h'|'i-l'|'m-p'|'q-t'|'u-x'][]}
 */
const strata = [
	[['a', 'b', 'c', 'd'], 'a-d'],
	[['e', 'f', 'g', 'h'], 'e-h'],
	[['i', 'j', 'k', 'l'], 'i-l'],
	[['m', 'n', 'o', 'p'], 'm-p'],
	[['q', 'r', 's', 't'], 'q-t'],
	[['u', 'v', 'w', 'x'], 'u-x']
];

const rawQuestions = fs.readFileSync(path.join(__dirname, './questions.js')).toString();
const [requireStrings, questionsString] = rawQuestions.split('exports.questions');

const repathedRequireStrings = requireStrings
	.replaceAll("require('../", "require('../../")
	.replaceAll("require('./", "require('../");

/**
 * @param {string} fileStr
 * @param {string[]} questionNames
 */
const getQuestionStrings = (fileStr, questionNames) => {
	/**
	 * @type {Record<string, string>}
	 */
	const questionStrings = {};
	while (questionNames.length) {
		const questionName = questionNames.pop();
		if (!questionName) continue;

		const questionStrStartIndex = fileStr.indexOf(questionName);
		const firstBracketIndex = fileStr.indexOf('(', questionStrStartIndex) + 1;

		let questionStr = fileStr.slice(questionStrStartIndex, firstBracketIndex);
		let bracketCount = 1;
		let itteredChars = 0;

		while (bracketCount) {
			const char = fileStr.charAt(firstBracketIndex + itteredChars);
			if (char === '(') bracketCount++;
			if (char === ')') bracketCount--;
			questionStr += char;
			itteredChars++;
		}
		questionStrings[questionName] = questionStr;
	}
	return questionStrings;
};

const questionStrings = getQuestionStrings(questionsString, Object.keys(questions));

const questionSections = Object.keys(questions).reduce(
	(acc, questionName) => {
		const [, section] = strata.find(([letters]) => letters.includes(questionName.charAt(0))) || [];
		const questionString = questionStrings[questionName];

		if (!section || !questionString) throw new Error('badness');
		return { ...acc, [section]: { ...acc[section], [questionName]: questionString } };
	},
	{
		['a-d']: {},
		['e-h']: {},
		['i-l']: {},
		['m-p']: {},
		['q-t']: {},
		['u-x']: {}
	}
);

Object.entries(questionSections).forEach(([sectionName, questionSection]) => {
	const fileString = `${repathedRequireStrings}\nmodule.exports = {${Object.values(
		questionSection
	).join(',\n')}}`;
	fs.writeFileSync(path.join(__dirname, './questions', `./${sectionName}`) + '.js', fileString);
});
