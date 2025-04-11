const { addCSStoHtml } = require('./add-css-to-html');

describe('lib/add-css-to-html', () => {
	beforeEach(() => {});
	it('adds main.css to HTML with valid <head> element', async () => {
		const html =
			'<head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';

		const result = await addCSStoHtml(html);

		expect(result.startsWith('<head><style>')).toBe(true);
		expect(result.includes('.govuk')).toBe(true);
		expect(
			result.endsWith(
				'<title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>'
			)
		).toBe(true);
	});
	it('returns HTML without CSS added if <head> element absent from HTML', async () => {
		const html = '<body><h1>test html</h2></body>';

		const result = await addCSStoHtml(html);

		expect(result).toEqual(html);
	});
	it('returns HTML without CSS added if multiple <head> elements found in HTML', async () => {
		const html =
			'<head><title>test</title><link rel="stylesheet" href="style.css"></head><head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';

		const result = await addCSStoHtml(html);

		expect(result).toEqual(html);
	});
});
