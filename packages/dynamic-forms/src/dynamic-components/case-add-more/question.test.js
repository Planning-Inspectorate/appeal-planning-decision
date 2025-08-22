const CaseAddMoreQuestion = require('./question');

const question = new CaseAddMoreQuestion({
	title: 'Test Title',
	question: 'Test Question',
	fieldName: 'testField',
	viewFolder: 'testFolder'
});

describe('CaseAddMoreQuestion', () => {
	describe('getDataToSave', () => {
		it('should return an object with addMoreId and value', async () => {
			const req = { body: { testField: 'Test Value' } };
			const data = await question.getDataToSave(req);
			expect(data).toHaveProperty('addMoreId');
			expect(data).toHaveProperty('value', 'Test Value');
		});
	});

	describe('format', () => {
		it('should return formatted caseRef from answer', () => {
			const formattedCase = question.format({ caseReference: 'Test Case Reference' });
			expect(formattedCase).toBe('Test Case Reference');
		});

		it('should return undefined if answer is null', () => {
			const formattedCase = question.format(null);
			expect(formattedCase).toBeUndefined();
		});
	});

	describe('getAddMoreAnswers', () => {
		it('should return cases for question', () => {
			const fieldName = 'abc';
			const response = {
				answers: {
					SubmissionLinkedCase: [
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

		it('should return empty array if no linkedCases', () => {
			const result = question.getAddMoreAnswers({ answers: {} }, 'fieldName');
			expect(result.length).toBe(0);
		});
	});

	describe('saveList', () => {
		const mockReq = {
			appealsApiClient: {
				postSubmissionLinkedCase: jest.fn()
			}
		};

		const mockJourneyResponse = {
			journeyId: 'mockJourneyId',
			referenceId: 'mockReferenceId'
		};

		it('should save linked cases and return true', async () => {
			const responseToSave = {
				answers: {
					parentFieldName: [{ value: 'Case1' }, { value: 'Case2' }]
				}
			};

			mockReq.appealsApiClient.postSubmissionLinkedCase.mockResolvedValueOnce();

			await question.saveList(mockReq, 'parentFieldName', mockJourneyResponse, responseToSave);

			expect(mockReq.appealsApiClient.postSubmissionLinkedCase).toHaveBeenCalledTimes(2);
			expect(mockReq.appealsApiClient.postSubmissionLinkedCase).toHaveBeenCalledWith(
				'mockJourneyId',
				'mockReferenceId',
				{
					fieldName: 'testField',
					caseReference: 'Case1'
				}
			);
			expect(mockReq.appealsApiClient.postSubmissionLinkedCase).toHaveBeenCalledWith(
				'mockJourneyId',
				'mockReferenceId',
				{
					fieldName: 'testField',
					caseReference: 'Case2'
				}
			);
		});
	});

	describe('removeList', () => {
		const mockReq = {
			appealsApiClient: {
				deleteSubmissionLinkedCase: jest.fn()
			}
		};

		const mockJourneyResponse = {
			journeyId: 'mockJourneyId',
			referenceId: 'mockReferenceId',
			answers: {
				SubmissionLinkedCase: [{ id: 'case1' }, { id: 'case2' }]
			}
		};

		it('should remove linked case and return updated JourneyResponse', async () => {
			mockReq.appealsApiClient.deleteSubmissionLinkedCase.mockResolvedValueOnce({
				SubmissionLinkedCase: [{ id: 'case2' }]
			});

			const updatedResponse = await question.removeList(mockReq, mockJourneyResponse, 'case1');

			expect(updatedResponse.answers.SubmissionLinkedCase).toHaveLength(1);
			expect(updatedResponse.answers.SubmissionLinkedCase[0]).toEqual({ id: 'case2' });
		});

		it('should return true if no linked cases are left after removal', async () => {
			mockReq.appealsApiClient.deleteSubmissionLinkedCase.mockResolvedValueOnce({
				SubmissionLinkedCase: []
			});

			const updatedResponse = await question.removeList(mockReq, mockJourneyResponse, 'case1');

			expect(updatedResponse).toBe(true);
		});
	});
});
