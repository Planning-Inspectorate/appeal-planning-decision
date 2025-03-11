const { ServiceUserRepository } = require('#repositories/sql/service-user-repository');

const serviceUserRepository = new ServiceUserRepository();

/**
 * @param {import('pins-data-model/src/schemas').ServiceUser} data
 * @returns {Promise<import('@prisma/client').ServiceUser>}
 */
exports.put = (data) => {
	return serviceUserRepository.put(data);
};

/**
 * @param {string} serviceUserId
 * @param {string} caseReference
 * @returns {Promise<import("#repositories/sql/service-user-repository").ServiceUserName|null>}
 */
exports.getServiceUserByIdAndCaseReference = (serviceUserId, caseReference) => {
	return serviceUserRepository.getServiceUserByIdAndCaseReference(serviceUserId, caseReference);
};

/**
 * @param {string[]|null} serviceUserIds
 * @param {string} caseReference
 * @returns {Promise<import("#repositories/sql/service-user-repository").BasicServiceUser[]>|[]}
 */
exports.getServiceUsersWithEmailsByIdAndCaseReference = (serviceUserIds, caseReference) => {
	if (!serviceUserIds || serviceUserIds.length === 0) return [];

	return serviceUserRepository.getServiceUsersWithEmailsByIdAndCaseReference(
		serviceUserIds,
		caseReference
	);
};
