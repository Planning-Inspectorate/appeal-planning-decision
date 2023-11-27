const { exec } = require('child_process');

/**
 * Runs a command and resolves with stdout
 *
 * @param {string} cmd
 * @returns {Promise<string>}
 */
function runCommand(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}

module.exports = {
	runCommand
};
