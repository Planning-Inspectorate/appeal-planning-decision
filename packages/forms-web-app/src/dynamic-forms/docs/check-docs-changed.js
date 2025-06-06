const { execSync } = require('child_process');

function getStatus() {
	return execSync('git status --porcelain', { encoding: 'utf8' });
}

const beforeStatus = getStatus();

try {
	execSync('npm run doc', { stdio: 'inherit' });
} catch (err) {
	process.exit(1);
}

const afterStatus = getStatus();

if (beforeStatus !== afterStatus) {
	console.error('Changes detected in documentation');
	process.exit(1);
}
