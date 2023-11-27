/**
 * @typedef {Object} IssueDetails
 * @property {string} title
 * @property {string} status
 * @property {string} [parentTitle]
 */

/**
 * Use the JIRA api to get information about issues.
 *
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v2/intro/#ad-hoc-api-calls
 */
class JiraApi {
	/**
	 *
	 * @param {Object} options
	 * @param {string} options.baseUrl
	 * @param {string} options.username
	 * @param {string} options.apiKey
	 */
	constructor({ baseUrl, username, apiKey }) {
		if (!baseUrl) {
			throw new Error('baseUrl is required for JiraApi');
		}
		if (!username) {
			throw new Error('username is required for JiraApi');
		}
		if (!apiKey) {
			throw new Error('apiKey is required for JiraApi');
		}
		this.baseUrl = baseUrl;
		// basic auth value
		this.authHeader = 'Basic ' + Buffer.from(`${username}:${apiKey}`).toString('base64');
	}

	/**
	 * Fetch basic details about an issue
	 *
	 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issues/#api-rest-api-2-issue-issueidorkey-get
	 *
	 * @param {string} id
	 * @returns {Promise<IssueDetails>}
	 */
	async fetchIssue(id) {
		const url = `${this.baseUrl}/rest/api/2/issue/${id}?fields=status,summary,parent`;
		console.log('GET', url);
		const res = await fetch(url, {
			headers: {
				Authorization: this.authHeader
			}
		});
		const json = await res.json();
		return {
			title: json.fields.summary,
			status: json.fields.status.name,
			parentTitle: json.fields.parent?.fields?.summary
		};
	}

	/**
	 * @param {string} id
	 * @returns {string}
	 */
	issueLink(id) {
		return `${this.baseUrl}/browse/${id}`;
	}
}

module.exports = {
	JiraApi
};
