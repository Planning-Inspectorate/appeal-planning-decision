const { use } = require('./router-mock');
const appellantSubmissionRouter = require('../../../src/routes/appellant-submission');
const eligibilityRouter = require('../../../src/routes/eligibility');
const homeRouter = require('../../../src/routes/home');
const cookieRouter = require('../../../src/routes/cookies');
const guidancePagesRouter = require('../../../src/routes/guidance-pages');
const yourPlanningAppealRouter = require('../../../src/routes/your-planning-appeal');
const fullAppealRouter = require('../../../src/routes/full-appeal/submit-appeal');
const fullAppealBeforeYouStartRouter = require('../../../src/routes/full-appeal/index');
const householderPlanningRouter = require('../../../src/routes/householder-planning/index');
const documentRouter = require('../../../src/routes/document');
const beforeYouStartRouter = require('../../../src/routes/before-you-start/before-you-start');
const submitAppealRouter = require('../../../src/routes/submit-appeal');
const saveAndReturnRouter = require('../../../src/routes/save');
const checkDecisionDateDeadline = require('../../../src/middleware/check-decision-date-deadline');
const checkPathAllowed = require('../../../src/middleware/check-path-allowed');
const { skipMiddlewareForPaths } = require('../../../src/middleware/skip-middleware-for-paths');

jest.mock('../../../src/middleware/skip-middleware-for-paths');

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
		expect(use).toHaveBeenCalledWith('/', guidancePagesRouter);
		expect(use).toHaveBeenCalledWith('/cookies', cookieRouter);
		expect(use).toHaveBeenCalledWith(
			'/appellant-submission',
			checkPathAllowed,
			checkDecisionDateDeadline,
			appellantSubmissionRouter
		);
		expect(use).toHaveBeenCalledWith(
			'/full-appeal',
			skipMiddlewareForPaths(checkPathAllowed, ['submit-final-comment', 'enter-code']),
			skipMiddlewareForPaths(checkDecisionDateDeadline, ['submit-final-comment']),
			fullAppealRouter
		);
		expect(use).toHaveBeenCalledWith('/eligibility', checkDecisionDateDeadline, eligibilityRouter);
		expect(use).toHaveBeenCalledWith('/your-planning-appeal', yourPlanningAppealRouter);
		expect(use).toHaveBeenCalledWith(
			'/before-you-start',
			checkPathAllowed,
			checkDecisionDateDeadline,
			fullAppealBeforeYouStartRouter
		);
		expect(use).toHaveBeenCalledWith(
			'/before-you-start',
			checkPathAllowed,
			checkDecisionDateDeadline,
			householderPlanningRouter
		);
		expect(use).toHaveBeenCalledWith('/document', documentRouter);

		expect(use).toHaveBeenCalledWith('/before-you-start', beforeYouStartRouter);
		expect(use).toHaveBeenCalledWith(
			'/submit-appeal',
			checkPathAllowed,
			checkDecisionDateDeadline,
			submitAppealRouter
		);
		expect(use).toHaveBeenCalledWith(
			'/save-and-return',
			checkPathAllowed,
			checkDecisionDateDeadline,
			saveAndReturnRouter
		);
	});
});
