module.exports = {
	extends: ['@commitlint/environments-conventional'],
	ignores: [
		(message) => message.startsWith('Auto-release'),
		(message) => message.includes('[ci skip]')
	],
	prompt: {
		questions: {
			scope: {
				description: 'Please add the Jira ticket number if available or a short title if not'
			}
		}
	}
};
