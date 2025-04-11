const fs = require('fs').promises;
const path = require('path');

/**
 * @param {string} html
 * @returns {Promise<string>} html with added css if <head> valid, otherwise returns unedited html passed in
 */
const addCSStoHtml = async (html) => {
	const htmlArray = html.split('<head>');
	if (htmlArray.length !== 2) return html;

	const cssFilePath = path.join(__dirname, '../public/stylesheets', 'main.css');
	const css = await fs.readFile(cssFilePath, 'utf8');

	return htmlArray[0] + `<head><style>${css}</style>` + htmlArray[1];
};

module.exports = { addCSStoHtml };
