import { commitlintConfig } from '@planning-inspectorate/coding-standards';

export default {
	...commitlintConfig,
	prompt: {
		questions: {
			scope: {
				description: 'Please add the Jira ticket number if available or a short title if not'
			}
		}
	}
};
