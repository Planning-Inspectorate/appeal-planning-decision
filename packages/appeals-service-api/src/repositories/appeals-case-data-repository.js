const { MongoRepository } = require('./mongo-repository');
const {
	APPEALS_CASE_DATA: {
		APPEAL_TYPE: { HAS },
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
			questionnaireDueDate: 1
		};

		result = await this.getAllDocumentsThatMatchQuery(
			{
				LPACode: lpaCode,
				appealType: HAS,
				validity: IS_VALID,
				questionnaireDueDate: { $type: 'date' },
				questionnaireReceived: { $not: { $type: 'date' } }
			},
			appealsProjection
		);
		result.forEach((item) => {
			item.caseReferenceSlug = encodeUrlSlug(item.caseReference);
		});

		result.sort((a, b) => {
			if (!a.questionnaireDueDate || !b.questionnaireDueDate) {
				return 0;
			}

			return a.questionnaireDueDate.getTime() - b.questionnaireDueDate.getTime();
		});

		return result;
	}
	async getAppealByLpaCodeAndCaseRef(lpaCode, caseRef) {
		const result = await this.findOneByQuery({
			LPACode: lpaCode,
			caseReference: caseRef,
			appealType: HAS,
			validity: IS_VALID,
			questionnaireDueDate: { $type: 'date' },
			questionnaireReceived: { $not: { $type: 'date' } }
		});

		result.caseReferenceSlug = encodeUrlSlug(result.caseReference);

		return result;
	}
}

module.exports = AppealsCaseDataRepository;
