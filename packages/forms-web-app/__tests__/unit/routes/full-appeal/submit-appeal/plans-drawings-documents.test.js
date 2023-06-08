const { get, post } = require('../../router-mock');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../../../../../src/middleware/req-files-to-req-body-files');
const setSectionAndTaskNames = require('../../../../../src/middleware/set-section-and-task-names');
const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');
const {
	rules: multifileUploadValidationRules
} = require('../../../../../src/validators/common/multifile-upload');
const {
	rules: checkDocumentUploadedValidationRules
} = require('../../../../../src/validators/common/check-document-uploaded');
const {
	getAppealMultiFileUpload,
	postAppealMultiFileUpload
} = require('../../../../../src/controllers/common/appeal-multi-file-upload');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/middleware/set-section-and-task-names');
jest.mock('../../../../../src/middleware/req-files-to-req-body-files');
jest.mock('../../../../../src/validators/common/multifile-upload');
jest.mock('../../../../../src/validators/validation-error-handler');
jest.mock('../../../../../src/validators/common/check-document-uploaded');
jest.mock('../../../../../src/controllers/common/appeal-multi-file-upload');

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
			getAppealMultiFileUpload()
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
			postAppealMultiFileUpload()
		);

		expect(setSectionAndTaskNames).toHaveBeenCalledWith(
			'planningApplicationDocumentsSection',
			'plansDrawingsSupportingDocuments'
		);

		expect(getAppealMultiFileUpload).toHaveBeenCalledWith(
			VIEW.FULL_APPEAL.PLANS_DRAWINGS_DOCUMENTS
		);

		expect(reqFilesToReqBodyFilesMiddleware).toHaveBeenCalledWith('file-upload');
		expect(checkDocumentUploadedValidationRules).toHaveBeenCalledWith(
			'file-upload',
			'plansDrawingsSupportingDocuments',
			'appeal',
			'Select your plans, drawings and supporting documents'
		);
		expect(multifileUploadValidationRules).toHaveBeenCalledWith('files.file-upload.*');
		expect(postAppealMultiFileUpload).toHaveBeenCalledWith(
			VIEW.FULL_APPEAL.PLANS_DRAWINGS_DOCUMENTS,
			VIEW.FULL_APPEAL.DESIGN_ACCESS_STATEMENT_SUBMITTED,
			'plansDrawingsSupportingDocuments',
			'plansDrawingsSupportingDocuments'
		);
	});
});
