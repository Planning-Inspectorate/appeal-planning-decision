// base section class

class Section {
	name;
	segment;
	questions = [];

	constructor(name, segment) {
		this.name = name;
		this.segment = segment;
	}

	// Fluent API method for adding questions
	addQuestion(question) {
		this.questions.push(question);
		return this;
	}

	//Fluent API method for attaching conditions to the previously added question
	withCondition(shouldIncludeQuestion) {
		if (!shouldIncludeQuestion) {
			this.questions.pop();
		}
		return this;
	}

	//todo: taskList withCondition - i.e. evaluate whether question should be
	//included in taskList (summary list) or not. See also comment in Question class
	//constructor - should only evaluate if on task list view
}

module.exports = { Section };
