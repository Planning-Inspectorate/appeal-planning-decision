const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getPlanningDepartment,
	postPlanningDepartment
} = require('../../../../src/controllers/full-appeal/local-planning-authority');
const { getDepartmentFromId } = require('../../../../src/services/department.service');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { getDepartmentFromName } = require('../../../../src/services/department.service');
const { getRefreshedDepartmentData } = require('../../../../src/services/department.service');
const logger = require('../../../../src/lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { LOCAL_PLANNING_AUTHORITY }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/services/department.service');
jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/local-planning-authority', () => {
	let req;
	let res;
	let departmentsData;
	let departmentList;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		departmentsData = {
			departments: ['lpa1', 'lpa2', 'lpa3', 'lpa4'],
			eligibleDepartments: ['lpa1', 'lpa2'],
			ineligibleDepartments: ['lpa3', 'lpa4']
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

	describe('Local Planning Authority Controller Tests', () => {
		describe('getPlanningDepartment', () => {
			it('calls the correct template - appeal lpa code empty string', async () => {
				getRefreshedDepartmentData.mockResolvedValue(departmentsData);

				appeal.lpaCode = '';
				await getPlanningDepartment(req, res);

				expect(res.render).toBeCalledWith(LOCAL_PLANNING_AUTHORITY, {
					appealLPD: '',
					departments: departmentList
				});
			});

			it('calls the correct template - appeal lpa code unknown', async () => {
				getRefreshedDepartmentData.mockResolvedValue(departmentsData);
				getDepartmentFromId.mockResolvedValue(undefined);

				appeal.lpaCode = 'unknown';
				await getPlanningDepartment(req, res);

				expect(res.render).toBeCalledWith(LOCAL_PLANNING_AUTHORITY, {
					appealLPD: '',
					departments: departmentList
				});
			});

			it('calls the correct template - existing LPA code', async () => {
				getRefreshedDepartmentData.mockResolvedValue(departmentsData);
				getDepartmentFromId.mockResolvedValue({ name: 'lpdName' });

				appeal.lpaCode = 'lpdCode';
				await getPlanningDepartment(req, res);

				expect(res.render).toBeCalledWith(LOCAL_PLANNING_AUTHORITY, {
					appealLPD: 'lpdName',
					departments: departmentList
				});
			});
		});
		describe('postPlanningDepartment', () => {
			it('updates appeal when request body valid and redirects correctly', async () => {
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
				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/enforcement-notice');
			});

			it('re-renders page with error when errors in request body', async () => {
				getRefreshedDepartmentData.mockResolvedValue(departmentsData);

				const mockRequest = {
					...req,
					body: { errors: { 'local-planning-department': { msg: 'Invalid Value' } } }
				};

				await postPlanningDepartment(mockRequest, res);

				expect(res.redirect).not.toHaveBeenCalled();
				expect(res.render).toHaveBeenCalledWith(LOCAL_PLANNING_AUTHORITY, {
					appealLPD: '',
					departments: departmentList,
					errors: { 'local-planning-department': { msg: 'Invalid Value' } },
					errorSummary: []
				});
			});

			it('logs an error if the api call fails, and remains on the same page', async () => {
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

				expect(res.render).toHaveBeenCalledWith(LOCAL_PLANNING_AUTHORITY, {
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
});
