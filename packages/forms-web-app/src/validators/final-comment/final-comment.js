const { body } = require('express-validator');
const {
	rule: doesNotIncludeSensitiveInformationRule
} = require('../common/does-not-include-sensitive-information');
const {
	validation: {
		characterLimits: { finalComment: finalCommentMaxCharacters }
	}
} = require('../../config');

const rules = () => [
	body('final-comment')
		.notEmpty()
		.withMessage('Enter your final comment')
		.bail()
		.isLength({ max: finalCommentMaxCharacters })
		.withMessage(
			`Final comment must be ${finalCommentMaxCharacters.toLocaleString(
				'en-GB'
			)} characters or less.`
		),
	doesNotIncludeSensitiveInformationRule(
		'Select to confirm that you have not included any sensitive information in your final comment'
	)
];

module.exports = {
	rules
};
