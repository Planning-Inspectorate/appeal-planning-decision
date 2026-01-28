const { ServiceUserRepository } = require('#repositories/sql/service-user-repository');

const serviceUserRepository = new ServiceUserRepository();

/**
 * @param {import('@planning-inspectorate/data-model/src/schemas').ServiceUser} data
 * @returns {Promise<import('@pins/database/src/client/client').ServiceUser>}
 */
exports.put = (data) => {
	return serviceUserRepository.put(data);
};

/**
 * @param {string} email
 * @param {string} caseReference
 * @param {Array.<string>} serviceUserTypes
 * @returns {Promise<import("#repositories/sql/service-user-repository").ServiceUser|null>}
 */
exports.getForEmailCaseAndType = (email, caseReference, serviceUserTypes) => {
	return serviceUserRepository.getForEmailCaseAndType(email, caseReference, serviceUserTypes);
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
