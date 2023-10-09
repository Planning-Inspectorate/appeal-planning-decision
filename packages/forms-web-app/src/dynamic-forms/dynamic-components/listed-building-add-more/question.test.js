const AddMoreQuestion = require('../add-more/question');
const ListedBuildingAddMoreQuestion = require('./question');
const uuid = require('uuid');

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
			expect(result.value).toEqual({ fieldName: '1234567' });
		});
	});
});
