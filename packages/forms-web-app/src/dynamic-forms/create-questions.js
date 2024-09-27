/** @typedef {import('./question-props').QuestionProps} QuestionProps */

/**
 * @param {{[questionName: string]: QuestionProps}} questionPropsRecord
 * @param {Record<string, typeof import('./question')>} questionClasses
 */
exports.createQuestions = (questionPropsRecord, questionClasses) => {
	return Object.fromEntries(
		Object.entries(questionPropsRecord).map(([key, props]) => [
			key,
			// This error happens because many of the
			// question extensions hardcode their viewFolder
			// in their super call. We want view folder to be
			// optional in question params but it's necessary
			// to super Question.
			// @ts-ignore
			new questionClasses[props.type](props)
		])
	);
};
