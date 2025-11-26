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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
		await page.waitForSelector(locators.passwordInput, { visible: true, timeout: 10000 });
		await timeout(2000);
		await page.type(locators.passwordInput, config.password);
		await page.keyboard.press('Enter');
		await timeout(5000);
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    const browser = await puppeteer.launch({
        headless: false, // Set to false for debugging
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--ignore-certificate-errors']
    });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

    try {
        const page = await browser.newPage();
        await page.goto(config.loginUrl, { waitUntil: 'networkidle2', timeout: 120000 });

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
        // Debugging: Log the page URL to ensure navigation is successful
        console.log('Navigated to:', page.url());

=======
        // Debugging: Log the page URL to ensure navigation is successful
        console.log('Navigated to:', page.url());

>>>>>>> Stashed changes
=======
        // Debugging: Log the page URL to ensure navigation is successful
        console.log('Navigated to:', page.url());

>>>>>>> Stashed changes
=======
        // Debugging: Log the page URL to ensure navigation is successful
        console.log('Navigated to:', page.url());

>>>>>>> Stashed changes
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
        // Debugging: Log the error and capture the page's HTML
        console.error('AzureSignIn task failed:', error);
        const html = await page.content();
        console.log('Page HTML at failure:', html);
        await page.screenshot({ path: 'error-screenshot.png' });
        await browser.close();
        throw error;
    }
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
};

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
module.exports = { azureSignIn };