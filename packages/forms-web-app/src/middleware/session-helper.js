class SessionHelper {
	static setSession(session) {
		SessionHelper.session = session;
	}

	static getNavigationHistory() {
		return SessionHelper.session?.navigationHistory || [];
	}
}

module.exports = SessionHelper;
