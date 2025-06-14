const buildAllOfMessage = (validOptions) => (context) =>
	`You must have ${JSON.stringify(validOptions)} for ${context.path} but you have ${JSON.stringify(
		context.value
	)}`;

function allOfValidOptions(validOptions) {
	return this.test('allOfValidOptions', buildAllOfMessage(validOptions), (value) => {
		if (Array.isArray(value)) {
			return validOptions.every((item) => value.includes(item));
		}
		return true;
	});
}

function allOfSelectedOptions(fieldName, validOptions) {
	return this.test(
		'allOfSelectedOptions',
		`${fieldName} must be one or more of the following values: ${validOptions.join(', ')}`,
		(value) => {
			if (Array.isArray(value)) {
				return value.every((item) => validOptions.includes(item));
			}
			return false;
		}
	);
}

function maybeOption(fieldName, validOptions) {
	return this.test(
		'maybeOption',
		`${fieldName} must be one or more of the following values: ${validOptions.join(', ')}`,
		(value) => {
			if (value == null) return true; // allow null or undefined
			if (Array.isArray(value)) {
				return value.every((item) => validOptions.includes(item));
			}
			return false;
		}
	);
}

module.exports = {
	allOfValidOptions,
	allOfSelectedOptions,
	maybeOption
};
