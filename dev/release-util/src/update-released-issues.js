const dotenv = require('dotenv');
const { docopt } = require('docopt');
const { JiraApi } = require('./jira-api');

dotenv.config(); // load from .env
const username = process.env.JIRA_USERNAME;
const apiKey = process.env.JIRA_API_KEY;
const baseUrl = process.env.JIRA_BASE_URL;

const docs = `
Usage:
    update-released-issues --release-link=<release-link> --release-name=<release-name> <issues>...

        <issues> - issue ids to update
`;

/**
 * a cli tool to aid updating ticket statuses to released
 */
async function run() {
	const argv = docopt(docs);
	const issues = argv['<issues>'];
	const releaseLink = argv['--release-link'];
	const releaseName = argv['--release-name'];

	const jira = new JiraApi({ baseUrl, username, apiKey });

	/** @type {string[]} */
	const notTransitioned = [];
	/** @type {string[]} */
	const alreadyDone = [];

	/**
	 * @param {string} issue
	 * @returns {Promise<void>}
	 */
	async function tryTransitionIssue(issue) {
		try {
			const transitions = await jira.fetchIssueTransitions(issue);
			const released = transitions.find((t) => t.name === 'Released');
			if (!released) {
				if (transitions.length === 1 && transitions[0].name === 'Cancelled') {
					alreadyDone.push(issue);
				} else {
					console.log('no transition for', issue);
					notTransitioned.push(issue);
				}
				return;
			}
			await jira.transitionIssue(
				issue,
				released.id,
				`Released as part of [${releaseName}|${releaseLink}]`
			);
		} catch (e) {
			console.error(`issue ${issue} error`, e);
		}
	}

	await Promise.all(issues.map(tryTransitionIssue));
	console.log('not transitioned', notTransitioned);
	console.log('already done', alreadyDone);
}

run().catch(console.error);
