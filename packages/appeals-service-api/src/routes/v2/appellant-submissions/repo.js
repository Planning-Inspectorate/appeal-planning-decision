const { createPrismaClient } = require('#db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionCreateInput} AppellantSubmissionCreateInput
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionUpdateInput} AppellantSubmissionUpdateInput
 */

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get an appellant submission
	 *
	 * @param {{ appellantSubmissionId: string, userId: string }} params
	 * @returns {Promise<AppellantSubmission|null>}
	 */
	async get({ appellantSubmissionId, userId }) {
		try {
			return await this.dbClient.$transaction(async (tx) => {
				await tx.appealToUser.findFirstOrThrow({
					where: {
						userId,
						role: APPEAL_USER_ROLES.APPELLANT
					}
				});

				return await this.dbClient.appellantSubmission.findUnique({
					where: {
						id: appellantSubmissionId,
						Appeal: {
							Users: {
								some: {
									userId
								}
							}
						}
					},
					include: {
						SubmissionDocumentUpload: true,
						SubmissionAddress: true,
						SubmissionLinkedCase: true
					}
				});
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Create an appellant submission
	 *
	 * @param {{ userId: string, data: AppellantSubmissionCreateInput }} params
	 * @returns {Promise<AppellantSubmission>}
	 */
	async put({ userId, data }) {
		return await this.dbClient.$transaction(async (tx) => {
			await tx.appealToUser.findFirstOrThrow({
				where: {
					userId,
					role: APPEAL_USER_ROLES.APPELLANT
				}
			});

			return await this.dbClient.appellantSubmission.create({
				select: {
					id: true,
					LPACode: true,
					appealTypeCode: true,
					appealId: true
				},
				data: data
			});
		});
	}

	/**
	 * Create an appellant submission
	 *
	 * @param {{ userId: string, data: AppellantSubmissionCreateInput }} params
	 * @returns {Promise<AppellantSubmission>}
	 */
	async post({ userId, data }) {
		return await this.dbClient.$transaction(async (tx) => {
			return await tx.appeal.create({
				select: {
					AppellantSubmission: {
						select: {
							id: true,
							LPACode: true,
							appealTypeCode: true,
							appealId: true
						}
					}
				},
				data: {
					Users: {
						create: {
							userId,
							role: APPEAL_USER_ROLES.APPELLANT
						}
					},
					AppellantSubmission: {
						create: {
							...data
						}
					}
				}
			});
		});
	}

	/**
	 * Update an appellant submission
	 *
	 * @param {{ appellantSubmissionId: string, userId: string, data: AppellantSubmissionUpdateInput }} params
	 * @returns {Promise<AppellantSubmission|null>}
	 */
	async patch({ appellantSubmissionId, userId, data }) {
		try {
			return await this.dbClient.$transaction(async (tx) => {
				await tx.appealToUser.findFirstOrThrow({
					where: {
						userId,
						role: APPEAL_USER_ROLES.APPELLANT
					}
				});

				return await this.dbClient.appellantSubmission.update({
					where: {
						id: appellantSubmissionId,
						Appeal: {
							Users: {
								some: {
									userId
								}
							}
						}
					},
					select: {
						id: true,
						LPACode: true,
						appealTypeCode: true,
						appealId: true
					},
					data: data
				});
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}
};
