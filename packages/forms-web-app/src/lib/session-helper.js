const ACTION_KEY = 'action';
const APPEAL_KEY = 'appeal';
const APPEAL_SQL_ID = 'appealSqlId';
const EMAIL_KEY = 'email';
const ENTER_CODE_KEY = 'enterCode';
const ID = 'id';

const getSessionAppeal = (session) => session[APPEAL_KEY];

const getSessionAppealId = (session) => session[APPEAL_KEY][ID];

const getSessionAppealSqlId = (session) => session[APPEAL_KEY][APPEAL_SQL_ID];

/**
 * @param {import('express-session').Session} session
 * @param {boolean} appealInSession
 * @returns {string}
 */
const getSessionEmail = (session, appealInSession) => {
	if (appealInSession) {
		return session[APPEAL_KEY][EMAIL_KEY];
	} else {
		return session[EMAIL_KEY];
	}
};

const setSessionAppeal = (session, appeal) => {
	session[APPEAL_KEY] = appeal;
};

const setSessionEmail = (session, email, appealInSession) => {
	if (appealInSession) {
		session[APPEAL_KEY][EMAIL_KEY] = email;
	} else {
		session[EMAIL_KEY] = email;
	}
};

const setSessionEnterCode = (session, code, useExistingValue) => {
	if (useExistingValue) {
		session[ENTER_CODE_KEY] = session[ENTER_CODE_KEY] || code;
	} else {
		session[ENTER_CODE_KEY] = code;
	}
};

const setSessionEnterCodeAction = (session, action) => {
	session[ENTER_CODE_KEY][ACTION_KEY] = action;
};

module.exports = {
	getSessionAppeal,
	getSessionAppealId,
	getSessionAppealSqlId,
	getSessionEmail,
	setSessionAppeal,
	setSessionEmail,
	setSessionEnterCode,
	setSessionEnterCodeAction
};
