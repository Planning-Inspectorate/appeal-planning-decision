const { MongoRepository } = require('./mongo-repository');
const {
	APPEALS_CASE_DATA: {
		APPEAL_TYPE: { HAS, S78 },
		VALIDITY: { IS_VALID }
	}
} = require('@pins/common/src/constants');
const { encodeUrlSlug } = require('../lib/encode');

class AppealsCaseDataRepository extends MongoRepository {
	constructor() {
		super('appealsCaseData');
	}
	async getAppeals(lpaCode) {
		let result;

		const appealsProjection = {
			caseReference: 1,
			LPAApplicationReference: 1,
			questionnaireDueDate: 1,
			validity: 1,
			LPACode: 1
		};

		result = await this.getAllDocumentsThatMatchQuery(
			{
				LPACode: lpaCode,
				appealType: { $in: [HAS, S78] },
				validity: IS_VALID
			},
			{ questionnaireDueDate: 1 },
			appealsProjection
		);
		result.forEach((item) => {
			item.caseReferenceSlug = encodeUrlSlug(item.caseReference);
		});

		return result;
	}
	async getAppealByLpaCodeAndCaseRef(lpaCode, caseRef) {
		const result = await this.findOneByQuery({
			LPACode: lpaCode,
			caseReference: caseRef,
			appealType: { $in: [HAS, S78] },
			validity: IS_VALID
		});

		result.caseReferenceSlug = encodeUrlSlug(result.caseReference);

		return result;
	}
	async postAppealCaseData(caseData) {
		const filter = { caseReference: `${caseData.caseReference}`, LPACode: `${caseData.LPACode}` };
		return await this.updateOne(filter, {
			$set: caseData
		});
	}
}

module.exports = AppealsCaseDataRepository;
