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

describe('routes/full-appeal/submit-appeal/draft-planning-obligation', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/draft-planning-obligation');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/draft-planning-obligation',
			[fetchExistingAppealMiddleware],
			setSectionAndTaskNames(),
			getAppealMultiFileUpload()
		);

		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/draft-planning-obligation',
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
			'appealDocumentsSection',
			'draftPlanningObligations'
		);

		expect(getAppealMultiFileUpload).toHaveBeenCalledWith(
			VIEW.FULL_APPEAL.DRAFT_PLANNING_OBLIGATION
		);

		expect(reqFilesToReqBodyFilesMiddleware).toHaveBeenCalledWith('file-upload');
		expect(checkDocumentUploadedValidationRules).toHaveBeenCalledWith(
			'file-upload',
			'draftPlanningObligations',
			'appeal',
			'Select your draft planning obligation'
		);
		expect(multifileUploadValidationRules).toHaveBeenCalledWith('files.file-upload.*');
		expect(postAppealMultiFileUpload).toHaveBeenCalledWith(
			VIEW.FULL_APPEAL.DRAFT_PLANNING_OBLIGATION,
			VIEW.FULL_APPEAL.NEW_DOCUMENTS,
			'draftPlanningObligations',
			'draftPlanningObligations',
			'DRAFT PLANNING OBLIGATION'
		);
	});
});
