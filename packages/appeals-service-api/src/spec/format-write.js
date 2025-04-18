const prettier = require('prettier');
const fs = require('fs/promises');

/**
 * Format contents with prettier and write to file
 *
 * @param {string} filePath
 * @param {string} content
 */
exports.formatWrite = async (filePath, content) => {
	const options = await prettier.resolveConfig(filePath);
	if (options === null) {
		throw new Error(`no prettier config for ${filePath}`);
	}
	options.filepath = filePath;
	const formatted = await prettier.format(content, options);
	await fs.writeFile(filePath, formatted);
};
