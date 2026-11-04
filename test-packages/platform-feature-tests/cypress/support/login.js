// @ts-nocheck
/// <reference types="cypress"/>
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { BrowserAuthData } = require('../fixtures/browser-auth-data');

const locators = {
	usernameInput: 'input[name=loginfmt]',
	passwordInput: 'input[name=passwd]',
	pinsApplicationHeader: '#pins-applications-header',
	optTextInput: '.table-row'
};

const azureSignIn = async (config) => {
	const browser = await puppeteer.launch({
		headless: false, //false, //'new',
		ignoreHTTPSErrors: true,
		args: ['--no-sandbox', '--ignore-certificate-errors']
	});
	try {
		const page = await browser.newPage();
		await page.goto(config.loginUrl, { waitUntil: 'networkidle2', timeout: 0 });
		await page.waitForSelector(locators.usernameInput, { visible: true, timeout: 10000 });
		await page.type(locators.usernameInput, config.username);
		await page.keyboard.press('Enter');
		// wait for animation to show password input
		await page.waitForFunction(
			(selector) => {
				const input = document.querySelector(selector);
				if (!input || input.disabled || input.getAttribute('aria-hidden') === 'true') return false;
				return true;
			},
			{ timeout: 10000 },
			locators.passwordInput
		);
		await page.type(locators.passwordInput, config.password);
		await page.keyboard.press('Enter');
		// wait until we have gone through the auth callback
		await page.waitForFunction(
			(origin) =>
				location.origin === origin &&
				!location.pathname.startsWith('/.auth/') &&
				document.readyState === 'complete',
			{ timeout: 20000 },
			new URL(config.loginUrl).origin
		);

		const cookies = await getCookies(page);

		if (!fs.existsSync(BrowserAuthData.BrowserAuthDataFolder)) {
			fs.mkdirSync(BrowserAuthData.BrowserAuthDataFolder, { recursive: true });
		}
		fs.writeFileSync(
			path.resolve(
				BrowserAuthData.BrowserAuthDataFolder,
				`${config.id}-${BrowserAuthData.CookiesFile}`
			),
			JSON.stringify(cookies)
		);

		await browser.close();
		return cookies;
	} catch (error) {
		if (browser) {
			await browser.close();
		}
		throw error;
	}
};

async function getCookies(page) {
	const response = await page._client().send('Network.getAllCookies');
	return response.cookies;
}
module.exports = { azureSignIn };