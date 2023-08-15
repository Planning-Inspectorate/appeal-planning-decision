/***********************************************************
 * This file holds the base class definition for a journey *
 * (e.g. questionnaire). Specific journeys should be       *
 * defined in a class which extends this one               *
 ***********************************************************/

// todo:
// test
// refactor
// jsdoc
// remove hard coded tie ins to has questionnaire: build links on journey implementation?

class Journey {
	name;
	sections = [];
	response;

	constructor(response) {
		this.response = response;
	}

	getQuestionBySectionAndName(section, name) {
		return this.sections
			.find((s) => {
				return s.segment === section;
			})
			.questions.find((q) => {
				return q.fieldName === name;
			});
	}

	getNextQuestionUrl(caseRef, section, name, answers, reverse) {
		let foundSection = false;
		let takeNextQuestion = false;

		const sectionsStart = reverse ? this.sections.length - 1 : 0;
		for (let i = sectionsStart; reverse ? i >= 0 : i < this.sections.length; reverse ? i-- : i++) {
			if (this.sections[i].segment === section) {
				foundSection = true;
			}
			if (foundSection) {
				const questionsStart = reverse ? this.sections[i].questions.length - 1 : 0;
				for (
					let j = questionsStart;
					reverse ? j >= 0 : j < this.sections[i].questions.length;
					reverse ? j-- : j++
				) {
					if (takeNextQuestion) {
						return `/manage-appeals/questionnaire/${encodeURIComponent(caseRef)}/${
							this.sections[i].segment
						}/${this.sections[i].questions[j].fieldName}`;
					}
					if (this.sections[i].questions[j].fieldName === name) {
						takeNextQuestion = true;
					}
				}
			}
		}
		return `/manage-appeals/questionnaire/${encodeURIComponent(caseRef)}`;
	}

	getCurrentQuestionUrl = (caseRef, section, name) => {
		let foundSection = false;
		let takeNextQuestion = false;

		const sectionsStart = 0;
		for (let i = sectionsStart; i < this.sections.length; i++) {
			if (this.sections[i].segment === section) {
				foundSection = true;
			}
			if (foundSection) {
				const questionsStart = 0;
				for (let j = questionsStart; j < this.sections[i].questions.length; j++) {
					if (this.sections[i].questions[j].fieldName === name) {
						takeNextQuestion = true;
					}
					if (takeNextQuestion) {
						// todo: fix this (questionnaire undefined)
						return `/manage-appeals/questionnaire/${encodeURIComponent(caseRef)}/`;
						// ${
						// 	questionnaire.sections[i].segment
						// }/${questionnaire.sections[i].questions[j].fieldName}`;
					}
				}
			}
		}
		return `/manage-appeals/questionnaire/${encodeURIComponent(caseRef)}`;
	};
}

module.exports = { Journey };
