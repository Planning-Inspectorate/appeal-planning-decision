const { get, post } = require('../../router-mock');
const {
	getPlansDrawingsDocuments,
	postPlansDrawingsDocuments
} = require('../../../../../src/controllers/full-appeal/submit-appeal/plans-drawings-documents');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');
const {
	rules: multifileUploadValidationRules
} = require('../../../../../src/validators/common/multifile-upload');
const {
	rules: checkDocumentUploadedValidationRules
} = require('../../../../../src/validators/common/check-document-uploaded');

const setSectionAndTaskNames = require('../../../../../src/middleware/set-section-and-task-names');
const reqFilesToReqBodyFilesMiddleware = require('../../../../../src/middleware/req-files-to-req-body-files');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/multifile-upload');
jest.mock('../../../../../src/middleware/set-section-and-task-names');
jest.mock('../../../../../src/middleware/req-files-to-req-body-files');
jest.mock('../../../../../src/validators/common/check-document-uploaded');

describe('routes/full-appeal/submit-appeal/plans-drawings-documents', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/plans-drawings-documents');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/plans-drawings-documents',
			[fetchExistingAppealMiddleware],
			setSectionAndTaskNames(),
			getPlansDrawingsDocuments
		);
		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/plans-drawings-documents',
			setSectionAndTaskNames(),
			[
				reqFilesToReqBodyFilesMiddleware(),
				checkDocumentUploadedValidationRules(),
				multifileUploadValidationRules()
			],
			validationErrorHandler,
			postPlansDrawingsDocuments
		);

		expect(multifileUploadValidationRules).toHaveBeenCalledWith('files.file-upload.*');
		expect(setSectionAndTaskNames).toHaveBeenCalledWith(
			'planningApplicationDocumentsSection',
			'plansDrawingsSupportingDocuments'
		);

		expect(checkDocumentUploadedValidationRules).toHaveBeenCalledWith(
			'file-upload',
			'plansDrawingsSupportingDocuments',
			'appeal',
			'Select your plans, drawings and supporting documents'
		);
	});
});
