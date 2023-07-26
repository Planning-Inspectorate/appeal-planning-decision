const logger = require('../lib/logger');
const mongodb = require('../db/db');
const ApiError = require('../errors/apiError');
const { encodeUrlSlug } = require('../lib/encode');
const {
	APPEALS_CASE_DATA: {
		APPEAL_TYPE: { HAS },
		VALIDITY: { IS_VALID }
	}
} = require('@pins/common/src/constants');

const getAppeals = async (lpaCode) => {
	let result;

	const appealsProjection = {
		projection: {
			caseReference: 1,
			LPAApplicationReference: 1,
			questionnaireDueDate: 1
		}
	};

	if (!lpaCode) {
		throw ApiError.noLpaCodeProvided();
	}

	try {
		const cursor = await mongodb
			.get()
			.collection('appealsCaseData')
			.find(
				{
					LPACode: lpaCode,
					appealType: HAS,
					validity: IS_VALID,
					questionnaireDueDate: { $type: 'date' },
					questionnaireReceived: { $not: { $type: 'date' } }
				},
				appealsProjection
			);
		result = await cursor.toArray();
	} catch (err) {
		logger.error(err);
		throw ApiError.appealsCaseDataNotFound();
	}

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
};

module.exports = {
	getAppeals
};
