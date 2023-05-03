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

describe('routes/full-appeal/submit-appeal/plans-drawings', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/plans-drawings');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/plans-drawings',
			[fetchExistingAppealMiddleware],
			setSectionAndTaskNames(),
			getAppealMultiFileUpload()
		);

		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/plans-drawings',
			setSectionAndTaskNames(),
			[
				reqFilesToReqBodyFilesMiddleware(),
				checkDocumentUploadedValidationRules(),
				multifileUploadValidationRules()
			],
			validationErrorHandler,
			postAppealMultiFileUpload()
		);

		expect(setSectionAndTaskNames).toHaveBeenCalledWith('appealDocumentsSection', 'plansDrawings');

		expect(getAppealMultiFileUpload).toHaveBeenCalledWith(VIEW.FULL_APPEAL.PLANS_DRAWINGS);

		expect(reqFilesToReqBodyFilesMiddleware).toHaveBeenCalledWith('file-upload');
		expect(checkDocumentUploadedValidationRules).toHaveBeenCalledWith(
			'file-upload',
			'plansDrawings',
			'appeal',
			'Select a plan or drawing'
		);
		expect(multifileUploadValidationRules).toHaveBeenCalledWith('files.file-upload.*');
		expect(postAppealMultiFileUpload).toHaveBeenCalledWith(
			VIEW.FULL_APPEAL.PLANS_DRAWINGS,
			VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED,
			'decisionPlans',
			'plansDrawings',
			'LIST OF PLANS SUBMITTED AFTER LPA DECISION'
		);
	});
});
