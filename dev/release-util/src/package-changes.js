const { runCommand } = require('./command');
const { docopt } = require('docopt');

const docs = `
Usage:
    package-changes <from> [<to>]

        <from> - the git tag to check from (e.g. last release)
        <to> - the git tag to check upto, defaults to main
`;

/**
 * A CLI tool to show which packages have changes between two commits/tags.
 */
async function run() {
	const argv = docopt(docs);
	const from = argv['<from>'];
	const to = argv['<to>'] || 'main';

	const diff = await runCommand(`git diff --name-only ${from} ${to}`);
	const files = diff
		.split('\n')
		.filter(Boolean)
		.filter((f) => f.startsWith('packages/'));

	const dirs = new Set();
	for (const file of files) {
		const parts = file.split('/');
		dirs.add(parts[0] + '/' + parts[1]);
	}
	console.log(files.join('\n'));
	console.log('-'.repeat(80));
	console.log([...dirs].join('\n'));
}

run().catch(console.error);
