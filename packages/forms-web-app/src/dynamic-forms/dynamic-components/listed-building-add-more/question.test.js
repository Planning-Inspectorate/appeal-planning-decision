const { getListedBuilding } = require('../../../lib/appeals-api-wrapper');
const AddMoreQuestion = require('../add-more/question');
const ListedBuildingAddMoreQuestion = require('./question');
const uuid = require('uuid');

jest.mock('../../../lib/appeals-api-wrapper');

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
			getListedBuilding.mockResolvedValue(mockListedBuilding);

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
				}
			};

			const result = await listedBuildingAddMoreQuestion.getDataToSave(req);

			expect(uuid.validate(result.addMoreId)).toBeTruthy();
			expect(result.value).toEqual(mockListedBuilding);
		});
	});

	it('should not return data if API call errors', async () => {
		const error = new Error('api error');
		getListedBuilding.mockImplementation(() => {
			throw error;
		});
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
			}
		};

		let result;
		try {
			result = await listedBuildingAddMoreQuestion.getDataToSave(req);
		} catch (err) {
			expect(err).toEqual(error);
			expect(result).toBe(undefined);
		}
	});
});
