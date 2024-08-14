const AddMoreQuestion = require('../add-more/question');
const ListedBuildingAddMoreQuestion = require('./question');
const uuid = require('uuid');

const mockListedBuilding = {
	reference: '1234567',
	name: 'A House',
	listedBuildingGrade: 'II'
};

describe('ListedBuildingAddMoreQuestion', () => {
	const TITLE = 'title';
	const QUESTION = 'question';
	const FIELDNAME = 'fieldName';
	const VIEWFOLDER = 'viewFolder';
	const VALIDATORS = [];
	const HTML = 'html';

	const question = new ListedBuildingAddMoreQuestion({
		title: TITLE,
		question: QUESTION,
		fieldName: FIELDNAME,
		viewFolder: VIEWFOLDER,
		validators: VALIDATORS,
		html: HTML
	});

	describe('constructor', () => {
		it('should instantiate and inherit from AddMoreQuestion', () => {
			const listedBuildingAddMoreQuestion = new ListedBuildingAddMoreQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				viewFolder: VIEWFOLDER,
				validators: VALIDATORS,
				html: HTML
			});
			expect(listedBuildingAddMoreQuestion instanceof ListedBuildingAddMoreQuestion).toBeTruthy();
			expect(listedBuildingAddMoreQuestion instanceof AddMoreQuestion).toBeTruthy();
		});
	});

	describe('getDataToSave', () => {
		it('should return data correctly', async () => {
			const listedBuildingAddMoreQuestion = new ListedBuildingAddMoreQuestion({
				title: TITLE,
				question: QUESTION,
				fieldName: FIELDNAME,
				viewFolder: VIEWFOLDER,
				validators: VALIDATORS
			});

			const req = {
				body: {
					[FIELDNAME]: '1234567'
				},
				appealsApiClient: {
					getListedBuilding: jest.fn()
				}
			};
			req.appealsApiClient.getListedBuilding.mockResolvedValue(mockListedBuilding);

			const result = await listedBuildingAddMoreQuestion.getDataToSave(req);

			expect(uuid.validate(result.addMoreId)).toBeTruthy();
			expect(result.value).toEqual(mockListedBuilding);
		});
	});

	describe('getAddMoreAnswers', () => {
		it('should return listed buildings for question', () => {
			const fieldName = 'abc';
			const response = {
				answers: {
					SubmissionListedBuilding: [
						{
							fieldName,
							data: 1
						},
						{
							fieldName,
							data: 2
						},
						{
							fieldName: 'other',
							data: 3
						}
					]
				}
			};
			const result = question.getAddMoreAnswers(response, fieldName);
			expect(result.length).toBe(2);
		});

		it('should return empty array if no listed buildings', () => {
			const result = question.getAddMoreAnswers({ answers: {} }, 'fieldName');
			expect(result.length).toBe(0);
		});
	});

	describe('saveList', () => {
		const mockReq = {
			appealsApiClient: {
				postSubmissionListedBuilding: jest.fn()
			}
		};

		const mockJourneyResponse = {
			journeyId: 'mockJourneyId',
			referenceId: 'mockReferenceId'
		};

		it('should save listed buildings and return true', async () => {
			const responseToSave = {
				answers: {
					parentFieldName: [
						{ fieldName: 'testField', value: mockListedBuilding },
						{ fieldName: 'testField', value: mockListedBuilding }
					]
				}
			};

			mockReq.appealsApiClient.postSubmissionListedBuilding.mockResolvedValueOnce();

			await question.saveList(mockReq, 'parentFieldName', mockJourneyResponse, responseToSave);

			expect(mockReq.appealsApiClient.postSubmissionListedBuilding).toHaveBeenCalledTimes(2);
			expect(mockReq.appealsApiClient.postSubmissionListedBuilding).toHaveBeenCalledWith(
				'mockJourneyId',
				'mockReferenceId',
				{
					fieldName: 'testField',
					...mockListedBuilding
				}
			);
			expect(mockReq.appealsApiClient.postSubmissionListedBuilding).toHaveBeenCalledWith(
				'mockJourneyId',
				'mockReferenceId',
				{
					fieldName: 'testField',
					...mockListedBuilding
				}
			);
		});
	});

	describe('removeList', () => {
		const mockReq = {
			appealsApiClient: {
				deleteSubmissionListedBuilding: jest.fn()
			}
		};

		const mockJourneyResponse = {
			journeyId: 'mockJourneyId',
			referenceId: 'mockReferenceId',
			answers: {
				SubmissionLinkedCase: [{ id: 'case1' }, { id: 'case2' }]
			}
		};

		it('should remove listed building and return updated JourneyResponse', async () => {
			mockReq.appealsApiClient.deleteSubmissionListedBuilding.mockResolvedValueOnce({
				SubmissionListedBuilding: [{ id: 'building2' }]
			});

			const updatedResponse = await question.removeList(mockReq, mockJourneyResponse, 'building2');

			expect(updatedResponse.answers.SubmissionListedBuilding).toHaveLength(1);
			expect(updatedResponse.answers.SubmissionListedBuilding[0]).toEqual({ id: 'building2' });
		});

		it('should return true if no listed buildings are left after removal', async () => {
			mockReq.appealsApiClient.deleteSubmissionListedBuilding.mockResolvedValueOnce({
				SubmissionListedBuilding: []
			});

			const updatedResponse = await question.removeList(mockReq, mockJourneyResponse, 'building1');

			expect(updatedResponse).toBe(true);
		});
	});

	it('should not return data if API call errors', async () => {
		const ref = '1234567';
		const error = new Error(`Could not find listed building: ${ref}`);
		const listedBuildingAddMoreQuestion = new ListedBuildingAddMoreQuestion({
			title: TITLE,
			question: QUESTION,
			fieldName: FIELDNAME,
			viewFolder: VIEWFOLDER,
			validators: VALIDATORS
		});

		const req = {
			body: {
				[FIELDNAME]: ref
			},
			appealsApiClient: {
				getListedBuilding: jest.fn()
			}
		};
		req.appealsApiClient.getListedBuilding.mockImplementation(() => {
			throw error;
		});

		let result;
		try {
			result = await listedBuildingAddMoreQuestion.getDataToSave(req);
		} catch (err) {
			expect(err).toEqual(error);
			expect(result).toBe(undefined);
		}
	});
});
