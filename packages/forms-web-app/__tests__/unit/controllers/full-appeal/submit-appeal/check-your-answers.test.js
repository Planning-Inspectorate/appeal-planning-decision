const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getCheckYourAnswers
} = require('../../../../../src/controllers/full-appeal/submit-appeal/check-your-answers');
const { getDepartmentFromId } = require('../../../../../src/services/department.service');
const { mockReq, mockRes } = require('../../../mocks');
const {
	VIEW: {
		FULL_APPEAL: { CHECK_YOUR_ANSWERS }
	}
} = require('../../../../../src/lib/views');

jest.mock('../../../../../src/services/department.service');

describe('controllers/full-appeal/submit-appeal/check-your-answers', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getCheckAnswers', () => {
		it('should call the correct template with empty local planning authority', () => {
			req.session.appeal.lpaCode = null;
			getCheckYourAnswers(req, res);
			expect(res.render).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS, {
				appealLPD: '',
				appeal
			});
		});
		it('should call the correct template with empty local planning authority', async () => {
			await getDepartmentFromId.mockResolvedValue(undefined);

			appeal.lpaCode = 'lpdCode';
			await getCheckYourAnswers(req, res);

			expect(res.render).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS, {
				appealLPD: '',
				appeal
			});
		});
		it('should call the correct template with local planning authority name', async () => {
			await getDepartmentFromId.mockResolvedValue({ name: 'lpdName' });

			appeal.lpaCode = 'lpdCode';
			await getCheckYourAnswers(req, res);

			expect(res.render).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS, {
				appealLPD: 'lpdName',
				appeal
			});
		});
	});
});
