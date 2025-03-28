const { use } = require('../router-mock');

const anyOfFollowingRouter = require('../../../../src/routes/full-appeal/any-of-following');
const grantedOrRefusedRouter = require('../../../../src/routes/full-appeal/granted-or-refused');
const localPlanningAuthorityRouter = require('../../../../src/routes/before-you-start/local-planning-authority');
const typeOfPlanningRouter = require('../../../../src/routes/before-you-start/type-of-planning-application');
const useExistingServiceApplicationType = require('../../../../src/routes/before-you-start/use-existing-service-application-type');
const outOfTimeRouter = require('../../../../src/routes/full-appeal/you-cannot-appeal');
const dateDecisionDueRouter = require('../../../../src/routes/full-appeal/date-decision-due');
const decisionDateRouter = require('../../../../src/routes/full-appeal/decision-date');
const priorApprovalExistingHomeRouter = require('../../../../src/routes/full-appeal/prior-approval-existing-home');
const useExistingServiceEnforcementNotice = require('../../../../src/routes/before-you-start/use-existing-service-enforcement-notice');

describe('routes/full-appeal/index', () => {
	beforeEach(() => {
		jest.resetModules();

		// eslint-disable-next-line global-require
		require('../../../../src/routes/full-appeal');
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(localPlanningAuthorityRouter);
		expect(use).toHaveBeenCalledWith(typeOfPlanningRouter);
		expect(use).toHaveBeenCalledWith(anyOfFollowingRouter);
		expect(use).toHaveBeenCalledWith(grantedOrRefusedRouter);
		expect(use).toHaveBeenCalledWith(useExistingServiceApplicationType);
		expect(use).toHaveBeenCalledWith(outOfTimeRouter);
		expect(use).toHaveBeenCalledWith(decisionDateRouter);
		expect(use).toHaveBeenCalledWith(dateDecisionDueRouter);
		expect(use).toHaveBeenCalledWith(priorApprovalExistingHomeRouter);
		expect(use).toHaveBeenCalledWith(useExistingServiceEnforcementNotice);
	});
});
