const ApiError = require('#errors/apiError');
const Repo = require('./repo');
const caseService = require('../../../../appeal-cases/service');
const repo = new Repo();
const { checkDocAccess } = require('@pins/common/src/access/document-access');
const logger = require('#lib/logger');

/**
 * @param {{
 * caseReference: string,
 * userId: string,
 * isLpa: boolean,
 * appealUserRoles: Array<import('@pins/database/src/client/client').AppealToUser>
 * access_token: import('express-oauth2-jwt-bearer').JWTPayload
 * id_token: object
 * }} params
 */
exports.get = async ({ caseReference, userId, isLpa, appealUserRoles, access_token, id_token }) => {
	/** @type {import('../../../../appeal-cases/service').AppealCase | null} */
	let data = null;

	if (isLpa) {
		// handle LPA user, no explicit appeal <-> user link
		data = await repo.getForLpaUser({ caseReference, userId });
	} else {
		// handle other users, with explicit appeal <-> user link
		data = await repo.get({ caseReference, userId, appealUserRoles });
	}

	if (data) {
		data = await caseService.appendAppellantAndAgent(data);
		data = await caseService.appendAppealRelations(data);
		data = await caseService.appendLinkedCases(data);

		data.Documents = data.Documents.map((doc) => ({
			...doc,
			userOwned: checkDocAccess({
				logger,
				documentWithAppeal: {
					...doc,
					AppealCase: {
						LPACode: data.LPACode,
						appealId: data.appealId,
						appealTypeCode: data.appealTypeCode
					}
				},
				appealUserRoles: appealUserRoles,
				access_token,
				id_token
			})
		}));

		return caseService.parseJSONFields(data);
	}

	throw ApiError.userNotFound();
};
