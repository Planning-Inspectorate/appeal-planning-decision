const { ServiceUserRepository } = require('#repositories/sql/service-user-repository');

const serviceUserRepository = new ServiceUserRepository();

/**
 * @param {Omit<import('@prisma/client').ServiceUser, 'internalId'>} data
 * @returns
 */
exports.put = (data) => {
	return serviceUserRepository.put(data);
};
