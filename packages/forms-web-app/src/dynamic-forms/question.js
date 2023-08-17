class Question {
	title;
	question;
	description;
	type;
	fieldName;
	validators = [];

	constructor({ title, question, description, type, fieldName } = {}) {
		if (!title || title === '') throw new Error('title parameter is mandatory');
		if (!question || question === '') throw new Error('question parameter is mandatory');
		if (!fieldName || fieldName === '') throw new Error('fieldName parameter is mandatory');
		this.title = title;
		this.question = question;
		this.description = description;
		this.type = type;
		this.fieldName = fieldName;
		//todo: taskList default to true, or pass in as param if question shouldn't be displayed in task (summary) list
		//or possibly add taskList condition to the Section class as part of withCondition method(or similar) if possible?
	}
}

module.exports = Question;
