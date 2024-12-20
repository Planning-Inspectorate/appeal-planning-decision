const { use } = require('./router-mock');

const config = require('../../../src/config');

const homeRouter = require('../../../src/routes/home');
const cookieRouter = require('../../../src/routes/cookies');
const accessibilityRouter = require('../../../src/routes/accessibility-statement/accessibility-statement');
const errorRouter = require('../../../src/routes/error');
const beforeYouStartRouter = require('../../../src/routes/before-you-start/before-you-start');
const fullAppealBeforeStartRouter = require('../../../src/routes/full-appeal/before-you-start');
const householderBeforeYouStart = require('../../../src/routes/householder-planning/before-you-start');
const householderPlanningRouter = require('../../../src/routes/appeal-householder-decision/');
const fullAppealRouter = require('../../../src/routes/full-appeal');
const appealRouter = require('../../../src/routes/appeal');
const appealsRouter = require('../../../src/routes/appeals');

const saveAndReturnRouter = require('../../../src/routes/save');
const submitAppealRouter = require('../../../src/routes/submit-appeal');
const appellantSubmissionRouter = require('../../../src/routes/appellant-submission');

const lpaRouter = require('../../../src/routes/lpa-dashboard');
const debugRouter = require('../../../src/routes//debug');

const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');
const checkAppealExists = require('#middleware/check-appeal-exists');
const checkLoggedIn = require('#middleware/check-logged-in');
const checkDebugAllowed = require('#middleware/check-debug-allowed');

describe('routes/index', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../src/routes');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith('/', homeRouter);
		expect(use).toHaveBeenCalledWith('/cookies', cookieRouter);
		expect(use).toHaveBeenCalledWith('/accessibility-statement', accessibilityRouter);
		expect(use).toHaveBeenCalledWith('/error', errorRouter);

		expect(use).toHaveBeenCalledWith('/before-you-start', beforeYouStartRouter);
		expect(use).toHaveBeenCalledWith(
			'/before-you-start',
			checkAppealExists,
			checkDecisionDateDeadline,
			fullAppealBeforeStartRouter
		);
		expect(use).toHaveBeenCalledWith(
			'/before-you-start',
			checkAppealExists,
			checkDecisionDateDeadline,
			householderBeforeYouStart
		);

		expect(use).toHaveBeenCalledWith('/appeal-householder-decision', householderPlanningRouter);
		expect(use).toHaveBeenCalledWith('/full-appeal', fullAppealRouter);

		expect(use).toHaveBeenCalledWith('/appeal', appealRouter);

		if (config.featureFlag.dashboardsEnabled) {
			expect(use).toHaveBeenCalledWith('/appeals', checkLoggedIn, appealsRouter);
		}

		expect(use).toHaveBeenCalledWith(
			'/save-and-return',
			checkLoggedIn,
			checkAppealExists,
			checkDecisionDateDeadline,
			saveAndReturnRouter
		);

		expect(use).toHaveBeenCalledWith(
			'/submit-appeal',
			checkLoggedIn,
			checkAppealExists,
			checkDecisionDateDeadline,
			submitAppealRouter
		);

		expect(use).toHaveBeenCalledWith(
			'/appellant-submission',
			checkLoggedIn,
			checkAppealExists,
			checkDecisionDateDeadline,
			appellantSubmissionRouter
		);

		if (config.featureFlag.dashboardsEnabled) {
			expect(use).toHaveBeenCalledWith('/manage-appeals', lpaRouter);
		}

		expect(use).toHaveBeenCalledWith('/debug', checkDebugAllowed, debugRouter);
	});
});
