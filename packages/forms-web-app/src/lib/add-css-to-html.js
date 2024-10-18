const config = require('../config');
const { default: fetch } = require('node-fetch');
/**
 * @param {string} html
 * @returns {Promise<string>} html with added css if <head> valid, otherwise returns unedited html passed in
 */
const addCSStoHtml = async (html) => {
	const htmlArray = html.split('<head>');
	if (htmlArray.length !== 2) return html;

	const response = await fetch(`${config.server.host}/public/stylesheets/main.css`);
	const css = await response.text();
	return htmlArray[0] + `<head><style>${css}</style>` + htmlArray[1];
};

module.exports = { addCSStoHtml };
