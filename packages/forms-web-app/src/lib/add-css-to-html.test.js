const { enableFetchMocks } = require('jest-fetch-mock');
enableFetchMocks();
const { addCSStoHtml } = require('./add-css-to-html');

const config = require('../config');
const { default: fetch } = require('node-fetch');

describe('lib/add-css-to-html', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});
	it('fetches and adds main.css to HTML with valid <head> element', async () => {
		const html =
			'<head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';
		const css = 'h1 { color: blue; text-align: center;}';
		fetch.mockResponseOnce(css);

		const result = await addCSStoHtml(html);

		expect(fetch).toHaveBeenCalledWith(`${config.server.host}/public/stylesheets/main.css`);
		expect(result).toEqual(
			'<head><style>' +
				css +
				'</style><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>'
		);
	});
	it('returns HTML without CSS added if <head> element absent from HTML', async () => {
		const html = '<body><h1>test html</h2></body>';

		const result = await addCSStoHtml(html);

		expect(fetch).not.toHaveBeenCalled();
		expect(result).toEqual(html);
	});
	it('returns HTML without CSS added if multiple <head> elements found in HTML', async () => {
		const html =
			'<head><title>test</title><link rel="stylesheet" href="style.css"></head><head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';

		const result = await addCSStoHtml(html);

		expect(fetch).not.toHaveBeenCalled();
		expect(result).toEqual(html);
	});
});
