const { ServiceUserRepository } = require('#repositories/sql/service-user-repository');

const serviceUserRepository = new ServiceUserRepository();

/**
 * @param {import('pins-data-model/src/schemas').ServiceUser} data
 * @returns
 */
exports.put = (data) => {
	return serviceUserRepository.put(data);
};
