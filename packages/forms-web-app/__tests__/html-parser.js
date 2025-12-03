const { prettyPrint } = require('html');
const { parse } = require('node-html-parser');

/**
 * Parses HTML and returns a root element, stripping nonce attributes from <style> tags.
 * @param {string} html
 * @param {Partial<import('node-html-parser').Options> & { rootElement?: string; stripSecurityStrings?: boolean, replacements?: Record<string, string> }} [options={}]
 * @returns {import('node-html-parser').HTMLElement & { pretty: function(): string }}
 */
module.exports.parseHtml = (
	html,
	{ rootElement = 'main', stripSecurityStrings = true, ...options } = {
		rootElement: 'main',
		stripSecurityStrings: true
	}
) => {
	const parsedHtml = parse(html, options).removeWhitespace();
	const root = parsedHtml.querySelector(rootElement);

	if (!root) {
		throw new Error(`Root element "${rootElement}" not found in HTML. ${parsedHtml}`);
	}

	// removes unique references where applicable
	if (stripSecurityStrings) {
		root.querySelectorAll('[nonce]').forEach((el) => el.removeAttribute('nonce'));
		root.querySelectorAll('input[name="_csrf"]').forEach((el) => el.remove());
	}

	if (options.replacements) {
		Object.entries(options.replacements).forEach(([placeholder, value]) => {
			root.innerHTML = root.innerHTML.replaceAll(placeholder, value);
		});
	}

	root.pretty = () => prettyPrint(root.toString());

	return root;
};
