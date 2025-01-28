const { ServiceUserRepository } = require('#repositories/sql/service-user-repository');

const serviceUserRepository = new ServiceUserRepository();

/**
 * @param {import('pins-data-model/src/schemas').ServiceUser} data
 * @returns
 */
exports.put = (data) => {
	return serviceUserRepository.put(data);
};

/**
 * @param {string} serviceUserId
 * @param {string} caseReference
 * @returns {Promise<import('pins-data-model/src/schemas').ServiceUser|null>}
 */
exports.getServiceUserByIdAndCaseReference = (serviceUserId, caseReference) => {
	return serviceUserRepository.getServiceUserByIdAndCaseReference(serviceUserId, caseReference);
};

/**
 * @param {string[]} serviceUserIds
 * @param {string} caseReference
 * @returns {import('pins-data-model/src/schemas').ServiceUser[]}
 */
exports.getServiceUsersWithEmailsByIdAndCaseReference = (serviceUserIds, caseReference) => {
	if (serviceUserIds.length === 0) return [];

	return serviceUserRepository.getServiceUsersWithEmailsByIdAndCaseReference(
		serviceUserIds,
		caseReference
	);
};
