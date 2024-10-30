const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getPlanningDepartment,
	postPlanningDepartment
} = require('../../../../src/controllers/full-appeal/local-planning-department');
const { getDepartmentFromId } = require('../../../../src/services/department.service');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { getDepartmentFromName } = require('../../../../src/services/department.service');
const { getRefreshedDepartmentData } = require('../../../../src/services/department.service');
const logger = require('../../../../src/lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { LOCAL_PLANNING_DEPARTMENT }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

jest.mock('../../../../src/services/department.service');
jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/local-planning-department', () => {
	let req;
	let res;
	let departmentsData;
	let departmentList;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		departmentsData = {
			departments: ['lpa1', 'lpa2'],
			eligibleDepartments: ['lpa1'],
			ineligibleDepartments: ['lpa2']
		};

		departmentList = [
			{
				selected: false,
				text: undefined,
				value: undefined
			},
			{
				selected: false,
				text: 'lpa1',
				value: 'lpa1'
			},
			{
				selected: false,
				text: 'lpa2',
				value: 'lpa2'
			}
		];

		jest.resetAllMocks();
	});

	describe('Local Planning Department Controller Tests', () => {
		it('Test the getPlanningDepartment method calls the correct template', async () => {
			getRefreshedDepartmentData.mockResolvedValue(departmentsData);

			appeal.lpaCode = '';
			await getPlanningDepartment(req, res);

			const { eligibleDepartments, ineligibleDepartments } = departmentsData;

			expect(res.render).toBeCalledWith(LOCAL_PLANNING_DEPARTMENT, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: '',
				departments: departmentList,
				eligibleDepartments,
				ineligibleDepartments
			});
		});

		it('Test the getPlanningDepartment method calls the correct template', async () => {
			getRefreshedDepartmentData.mockResolvedValue(departmentsData);
			getDepartmentFromId.mockResolvedValue(undefined);

			appeal.lpaCode = 'unknown';
			await getPlanningDepartment(req, res);

			const { eligibleDepartments, ineligibleDepartments } = departmentsData;

			expect(res.render).toBeCalledWith(LOCAL_PLANNING_DEPARTMENT, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: '',
				departments: departmentList,
				eligibleDepartments,
				ineligibleDepartments
			});
		});

		it('Test the getPlanningDepartment method with existing LPD calls the correct template', async () => {
			getRefreshedDepartmentData.mockResolvedValue(departmentsData);
			getDepartmentFromId.mockResolvedValue({ name: 'lpdName' });

			appeal.lpaCode = 'lpdCode';
			await getPlanningDepartment(req, res);

			const { eligibleDepartments, ineligibleDepartments } = departmentsData;

			expect(res.render).toBeCalledWith(LOCAL_PLANNING_DEPARTMENT, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: 'lpdName',
				departments: departmentList,
				eligibleDepartments,
				ineligibleDepartments
			});
		});

		it('Test the postPlanningDepartment method call with handled department', async () => {
			getRefreshedDepartmentData.mockResolvedValue(departmentsData);
			getDepartmentFromName.mockResolvedValue({ id: 'lpaCode1', name: 'lpa1' });

			const mockRequest = {
				...req,
				body: { 'local-planning-department': 'lpa1' }
			};

			await postPlanningDepartment(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				lpaCode: 'lpaCode1'
			});
		});

		it('Test the getPlanningDepartment method call with ineligible department', async () => {
			getRefreshedDepartmentData.mockResolvedValue(departmentsData);
			getDepartmentFromName.mockResolvedValue({ id: 'lpaCode1', name: 'lpa1' });

			const mockRequest = {
				...req,
				body: { errors: { 'local-planning-department': { msg: 'Ineligible Department' } } }
			};

			await postPlanningDepartment(mockRequest, res);

			expect(res.redirect).toHaveBeenCalledWith(
				'/before-you-start/use-existing-service-local-planning-department'
			);
		});

		it('Test the postPlanningDepartment method call on error', async () => {
			getRefreshedDepartmentData.mockResolvedValue(departmentsData);

			const mockRequest = {
				...req,
				body: { errors: { 'local-planning-department': { msg: 'Invalid Value' } } }
			};

			await postPlanningDepartment(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(LOCAL_PLANNING_DEPARTMENT, {
				bannerHtmlOverride: config.betaBannerText,
				appealLPD: '',
				departments: departmentList,
				errors: { 'local-planning-department': { msg: 'Invalid Value' } },
				errorSummary: []
			});
		});

		it('should log an error if the api call fails, and remain on the same page', async () => {
			const error = new Error('API is down');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
			getRefreshedDepartmentData.mockResolvedValue(departmentsData);
			getDepartmentFromName.mockResolvedValue({ id: 'lpaCode1', name: 'lpa1' });

			const mockRequest = {
				...req,
				body: { 'local-planning-department': 'lpa1' }
			};
			await postPlanningDepartment(mockRequest, res);
			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(LOCAL_PLANNING_DEPARTMENT, {
				bannerHtmlOverride: config.betaBannerText,
				appeal,
				departments: [
					departmentList[0],
					{
						...departmentList[1],
						selected: true
					},
					departmentList[2]
				],
				errorSummary: [{ text: error.toString(), href: 'local-planning-department' }],
				errors: {}
			});
		});
	});
});
