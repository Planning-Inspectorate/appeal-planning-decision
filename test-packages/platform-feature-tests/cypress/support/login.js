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

const timeout = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));

const azureSignIn = async (config) => {
	// Resolve potential chrome executable paths in priority order
	const candidatePaths = [];
	if (process.env.PUPPETEER_EXECUTABLE_PATH) candidatePaths.push(process.env.PUPPETEER_EXECUTABLE_PATH);
	if (process.env.CHROME_BIN) candidatePaths.push(process.env.CHROME_BIN);
	// Common system install locations
	if (process.platform === 'linux') {
		candidatePaths.push('/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium');
	} else if (process.platform === 'darwin') {
		candidatePaths.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
	} else if (process.platform === 'win32') {
		candidatePaths.push(
			process.env['PROGRAMFILES'] + '\\Google\\Chrome\\Application\\chrome.exe',
			process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe'
		);
	}
	// Remove duplicates / falsy
	const normalized = [...new Set(candidatePaths.filter(Boolean))];
	const launchArgs = ['--no-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors'];
	let lastError;
	let browser;
	for (let i = 0; i <= normalized.length; i++) {
		const executablePath = i < normalized.length ? normalized[i] : undefined; // final iteration tries bundled
		const launchOptions = {
			headless: process.env.CI ? 'new' : false,
			ignoreHTTPSErrors: true,
			args: launchArgs,
			// only set if defined
			...(executablePath ? { executablePath } : {})
		};
		try {
			if (executablePath) {
				console.log(`[azureSignIn] Attempting puppeteer launch with executablePath=${executablePath}`);
			} else {
				console.log('[azureSignIn] Attempting puppeteer launch with bundled chromium (no executablePath override)');
			}
			browser = await puppeteer.launch(launchOptions);
			break;
		} catch (err) {
			lastError = err;
			console.warn(`[azureSignIn] Launch attempt ${i + 1} failed${executablePath ? ' for ' + executablePath : ''}: ${err.message}`);
			if (i === normalized.length) {
				throw err; // all attempts exhausted
			}
		}
	}
	try {
		const page = await browser.newPage();
		await page.goto(config.loginUrl, { waitUntil: 'networkidle2', timeout: 0 });
		await page.waitForSelector(locators.usernameInput, { visible: true, timeout: 10000 });
		await page.type(locators.usernameInput, config.username);
		await page.keyboard.press('Enter');
		await page.waitForSelector(locators.passwordInput, { visible: true, timeout: 10000 });
		await timeout(2000);
		await page.type(locators.passwordInput, config.password);
		await page.keyboard.press('Enter');
		await timeout(5000);

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