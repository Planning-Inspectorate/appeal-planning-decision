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
}

module.exports = { Section };
