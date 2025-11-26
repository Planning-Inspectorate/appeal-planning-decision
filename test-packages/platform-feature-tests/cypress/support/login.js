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
        console.error('AzureSignIn task failed:', error);
        try {
            const html = await page.content();
            console.log('Page HTML at failure:', html);
            await page.screenshot({ path: 'error-screenshot.png' });
        } catch (e) {}
        await browser.close();
        throw error;
    }
};

module.exports = { azureSignIn };