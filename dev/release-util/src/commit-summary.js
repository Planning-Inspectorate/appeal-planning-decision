const dotenv = require('dotenv');
const { docopt } = require('docopt');
const fs = require('fs/promises');
const { runCommand } = require('./command');
const { Commit } = require('./commit');
const { JiraApi } = require('./jira-api');

dotenv.config(); // load from .env
const username = process.env.JIRA_USERNAME;
const apiKey = process.env.JIRA_API_KEY;
const baseUrl = process.env.JIRA_BASE_URL;
const githubRepoUrl = process.env.GITHUB_REPO_URL;

const docs = `
Usage:
    commit-summary <from> [<to>]

        <from> - the git tag to check from (e.g. last release)
        <to> - the git tag to check upto, defaults to main
`;

/**
 * a cli tool to aid with finding a good release candidate/tag
 * - pulls in commits from a given tag
 * - fetches ticket numbers from commit(scope)
 * - prints commit + ticket status
 */
async function run() {
	const argv = docopt(docs);
	const from = argv['<from>'];
	const to = argv['<to>'] || 'main';
	const separator = ',';

	const jira = new JiraApi({ baseUrl, username, apiKey });

	const changes = await runCommand(`git log --pretty="%H; %s" ${from}...${to}`);

	const commits = changes
		.split('\n') // split into lines
		.filter(Boolean); // filter out blank lines

	const rows = [
		`commit${separator}ticket${separator}title${separator}parent${separator}status${separator}commit link`
	];
	const tickets = new Map();
	for await (const commitLine of commits) {
		const commit = new Commit(commitLine);
		if (!commit.hasScope) {
			rows.push(`"${commit.message}"${separator}"N/A"`);
			continue;
		}
		if (!commit.scopeEndsInDigits) {
			rows.push(`"${commit.message}"${separator}"N/A"`);
			continue;
		}
		const ticketNumber = commit.ticketNumber;
		/** @type {import('./jira-api').IssueDetails} */
		let details;
		if (tickets.has(ticketNumber)) {
			details = tickets.get(ticketNumber);
		} else {
			details = await jira.fetchIssue(ticketNumber);
			tickets.set(ticketNumber, details);
		}
		rows.push(
			[
				commit.message,
				jira.issueLink(ticketNumber),
				details.title,
				details.parentTitle || '',
				details.status,
				commitLink(commit.hash)
			]
				.map((value) => `"${value}"`)
				.join(separator)
		);
	}

	await fs.writeFile(`./${from}-${to}.commits.csv`, rows.join('\n'));
	console.log('done', {
		commits: commits.length,
		tickets: tickets.size
	});
}

/**
 *
 * @param {string} hash
 * @returns {string}
 */
function commitLink(hash) {
	return `${githubRepoUrl}/commit/${hash}`;
}

run().catch(console.error);
