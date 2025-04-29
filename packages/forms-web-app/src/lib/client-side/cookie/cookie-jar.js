/* eslint-env browser */

// https://www.quirksmode.org/js/cookies.html

const createCookie = (document, name, value, days = 365) => {
	let expires = '';
	if (typeof days === 'number') {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = `; expires=${date.toUTCString()}`;
	}
	let secure = '';
	// eslint-disable-next-line no-unused-vars
	/* global process.env.NODE_ENV */
	if (process.env.NODE_ENV === 'production') {
		secure = '; secure';
	}
	// eslint-disable-next-line no-param-reassign
	document.cookie = `${name}=${encodeURIComponent(value)}${expires}${secure}; SameSite=Lax; path=/`;
};

const readCookie = (document, name) => {
	const nameEQ = `${name}=`;
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i += 1) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) === 0) {
			return decodeURIComponent(c.substring(nameEQ.length, c.length));
		}
	}
	return null;
};

const eraseCookie = (document, name) => {
	createCookie(document, name, '', -1);
};

module.exports = {
	createCookie,
	readCookie,
	eraseCookie
};
