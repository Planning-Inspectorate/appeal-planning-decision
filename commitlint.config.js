module.exports = {
	extends: ['@commitlint/config-conventional'],
	ignores: [
		(message) => message.startsWith('Auto-release'),
		(message) => message.includes('[ci skip]'),
		(message) => message.includes('dependabot')
	],
	prompt: {
		questions: {
			scope: {
				description: 'Please add the Jira ticket number if available or a short title if not'
			}
		}
	}
};
