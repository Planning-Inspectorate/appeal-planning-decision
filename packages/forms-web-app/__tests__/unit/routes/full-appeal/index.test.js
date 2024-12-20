const { use } = require('../router-mock');

const anyOfFollowingRouter = require('../../../../src/routes/full-appeal/any-of-following');
const grantedOrRefusedRouter = require('../../../../src/routes/full-appeal/granted-or-refused');
const localPlanningDepartmentRouter = require('../../../../src/routes/before-you-start/local-planning-department');
const typeOfPlanningRouter = require('../../../../src/routes/before-you-start/type-of-planning-application');
const useADifferentServiceRouter = require('../../../../src/routes/before-you-start/use-a-different-service');
const useExistingServiceApplicationType = require('../../../../src/routes/before-you-start/use-existing-service-application-type');
const outOfTimeRouter = require('../../../../src/routes/full-appeal/you-cannot-appeal');
const enforcementNoticeRouter = require('../../../../src/routes/full-appeal/enforcement-notice');
const dateDecisionDueRouter = require('../../../../src/routes/full-appeal/date-decision-due');
const decisionDateRouter = require('../../../../src/routes/full-appeal/decision-date');
const priorApprovalExistingHomeRouter = require('../../../../src/routes/full-appeal/prior-approval-existing-home');
const useExistingServiceEnforcementNotice = require('../../../../src/routes/full-appeal/use-existing-service-enforcement-notice');

describe('routes/full-appeal/index', () => {
	beforeEach(() => {
		jest.resetModules();

		// eslint-disable-next-line global-require
		require('../../../../src/routes/full-appeal');
	});

	it('should define the expected routes', () => {
		expect(use).toHaveBeenCalledWith(localPlanningDepartmentRouter);
		expect(use).toHaveBeenCalledWith(typeOfPlanningRouter);
		expect(use).toHaveBeenCalledWith(anyOfFollowingRouter);
		expect(use).toHaveBeenCalledWith(grantedOrRefusedRouter);
		expect(use).toHaveBeenCalledWith(useADifferentServiceRouter);
		expect(use).toHaveBeenCalledWith(useExistingServiceApplicationType);
		expect(use).toHaveBeenCalledWith(outOfTimeRouter);
		expect(use).toHaveBeenCalledWith(enforcementNoticeRouter);
		expect(use).toHaveBeenCalledWith(decisionDateRouter);
		expect(use).toHaveBeenCalledWith(dateDecisionDueRouter);
		expect(use).toHaveBeenCalledWith(priorApprovalExistingHomeRouter);
		expect(use).toHaveBeenCalledWith(useExistingServiceEnforcementNotice);
	});
});
