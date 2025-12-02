/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('./question-props').QuestionProps} QuestionProps
 */

/**
 * @param {JourneyResponse} response
 * @param {{[questionName: string]: QuestionProps}} questionPropsRecord
 * @param {Record<string, typeof import('./question')>} questionClasses
 * @param {{[questionType: string]: Record<string, Function>}} questionMethodOverrides
 */
exports.createQuestions = (
	response,
	questionPropsRecord,
	questionClasses,
	questionMethodOverrides
) => {
	return Object.fromEntries(
		Object.entries(questionPropsRecord).map(([questionName, props]) => [
			questionName,
			// This error happens because many of the
			// question extensions hardcode their viewFolder
			// in their super call. We want view folder to be
			// optional in question params but it's necessary
			// to super Question.
			// @ts-ignore
			new questionClasses[props.type](props, response, questionMethodOverrides[props.type])
		])
	);
};
