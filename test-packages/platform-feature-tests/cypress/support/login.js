// JavaScript
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

async function getCookies(page) {
    try {
        const response = await page._client().send('Network.getAllCookies');
        if (response && Array.isArray(response.cookies)) {
            return response.cookies;
        } else {
            console.error('No cookies array returned from Network.getAllCookies', response);
            return [];
        }
    } catch (err) {
        console.error('Error fetching cookies:', err);
        return [];
    }
}

const azureSignIn = async (config) => {
    const browser = await puppeteer.launch({
<<<<<<< Updated upstream
        headless: false,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--ignore-certificate-errors']
    });
    try {
        const page = await browser.newPage();
        await page.goto(config.loginUrl, { waitUntil: 'networkidle2', timeout: 120000 });

        // Retry logic for username input
        let retries = 3;
        while (retries > 0) {
            try {
                await page.waitForSelector(locators.usernameInput, { visible: true, timeout: 60000 });
                await page.type(locators.usernameInput, String(config.username || ''));
                await page.keyboard.press('Enter');
                break;
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
            }
        }

        await page.waitForSelector(locators.passwordInput, { visible: true, timeout: 60000 });
        await timeout(2000);
        await page.type(locators.passwordInput, String(config.password || ''));
        await page.keyboard.press('Enter');
        await timeout(5000);

        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 120000 });

        const cookies = await getCookies(page);

        if (!fs.existsSync(BrowserAuthData.BrowserAuthDataFolder)) {
            fs.mkdirSync(BrowserAuthData.BrowserAuthDataFolder, { recursive: true });
=======
        headless: false, // Set to false for debugging
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--ignore-certificate-errors']
    });

    try {
        const page = await browser.newPage();
        await page.goto(config.loginUrl, { waitUntil: 'networkidle2', timeout: 120000 });

        // Debugging: Log the page URL to ensure navigation is successful
        console.log('Navigated to:', page.url());

        // Retry logic for username input
        let retries = 3;
        while (retries > 0) {
            try {
                await page.waitForSelector(locators.usernameInput, { visible: true, timeout: 60000 });
                console.log('Username:', config.username);
                await page.type(locators.usernameInput, String(config.username || ''));
                await page.keyboard.press('Enter');
                break; // Exit loop if successful
            } catch (error) {
                retries--;
                console.warn(`Retrying username input... (${3 - retries} attempts left)`);
                if (retries === 0) {
                    throw error; // Throw error if all retries fail
                }
            }
        }

        // Wait for password input
        await page.waitForSelector(locators.passwordInput, { visible: true, timeout: 60000 });
        await timeout(2000);
        console.log('Password:', config.password);
        await page.type(locators.passwordInput, String(config.password || ''));
        await page.keyboard.press('Enter');

        // Optional: Handle additional steps like OTP if needed
        // await page.waitForSelector(locators.optTextInput, { visible: true, timeout: 10000 });
        // await page.click(locators.optTextInput);

        // Wait for navigation or additional delay
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 120000 });

        // Save cookies
        const cookies = await getCookies(page);

        if (!fs.existsSync(BrowserAuthData.BrowserAuthDataFolder)) {
            fs.mkdirSync(BrowserAuthData.BrowserAuthDataFolder);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        console.error('AzureSignIn task failed:', error);
        try {
            const html = await page.content();
            console.log('Page HTML at failure:', html);
            await page.screenshot({ path: 'error-screenshot.png' });
        } catch (e) {}
=======
        // Debugging: Log the error and capture the page's HTML
        console.error('AzureSignIn task failed:', error);
        const html = await page.content();
        console.log('Page HTML at failure:', html);
        await page.screenshot({ path: 'error-screenshot.png' });
>>>>>>> Stashed changes
        await browser.close();
        throw error;
    }
};

<<<<<<< Updated upstream
=======
async function getCookies(page) {
	//existing code
	/*const response = await page._client().send('Network.getAllCookies');
	return response.cookies;
	*/

	try {
		const response = await page._client().send('Network.getAllCookies');
		if (response && Array.isArray(response.cookies)) {
		  return response.cookies;
		} else {
		  console.error('No cookies array returned from Network.getAllCookies', response);
		  return [];
		}
	  } catch (err) {
		console.error('Error fetching cookies:', err);
		return [];
	  }
}
>>>>>>> Stashed changes
module.exports = { azureSignIn };