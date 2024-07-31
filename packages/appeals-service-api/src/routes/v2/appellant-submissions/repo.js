const { createPrismaClient } = require('#db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');
const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');

/**
 * @typedef {import('@prisma/client').AppellantSubmission} BareAppellantSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionGetPayload<{
 *   include: {
 *     SubmissionDocumentUpload: true,
 *     SubmissionAddress: true,
 *     SubmissionLinkedCase: true,
 *   }
 * }>} AppellantSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionGetPayload<{
 *   include: {
 *     SubmissionDocumentUpload: true,
 *     SubmissionAddress: true,
 *     SubmissionLinkedCase: true,
 * 		 SubmissionListedBuilding: true,
 *		 Appeal: {
 *       include: {
 *			   Users: {
 *           include: {
 *             AppealUser: true
 *           }
 *         }
 *		   }
 *     }
 *   }
 * }>} FullAppellantSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionCreateInput} AppellantSubmissionCreateInput
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionUpdateInput} AppellantSubmissionUpdateInput
 */

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {{ appellantSubmissionId: string, userId: string }} params
	 */
	async userOwnsAppealSubmission({ appellantSubmissionId, userId }) {
		try {
			const result = await this.dbClient.appellantSubmission.findUniqueOrThrow({
				where: {
					id: appellantSubmissionId
				},
				select: {
					Appeal: {
						select: {
							id: true,
							Users: {
								where: {
									userId,
									role: { in: [APPEAL_USER_ROLES.APPELLANT, APPEAL_USER_ROLES.AGENT] }
								}
							}
						}
					}
				}
			});

			if (!result.Appeal.Users.some((x) => x.userId.toLowerCase() === userId.toLowerCase())) {
				throw ApiError.forbidden();
			}

			return true;
		} catch (err) {
			logger.error({ err }, 'invalid user access');
			throw ApiError.forbidden();
		}
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
	 * @returns {Promise<BareAppellantSubmission>}
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
	 * @returns {Promise<BareAppellantSubmission>}
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
	 * @returns {Promise<BareAppellantSubmission|null>}
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

	/**
	 * @param {string} id
	 * @returns {Promise<{id: string}>}
	 */
	markAppealAsSubmitted(id) {
		return this.dbClient.appellantSubmission.update({
			where: {
				id: id
			},
			data: {
				submitted: true
			},
			select: {
				id: true
			}
		});
	}

	/**
	 * Get an appellant submission
	 *
	 * @param {{ appellantSubmissionId: string, userId: string }} params
	 * @returns {Promise<FullAppellantSubmission|null>}
	 */
	async getForBOSubmission({ appellantSubmissionId, userId }) {
		try {
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
					SubmissionLinkedCase: true,
					SubmissionListedBuilding: true,
					Appeal: {
						include: {
							Users: {
								include: {
									AppealUser: true
								}
							}
						}
					}
				}
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
	 * Get all non submitted submissions
	 * @returns {Promise<BareAppellantSubmission[]>}
	 */
	async getNonSubmittedSubmissions() {
		try {
			return this.dbClient.appellantSubmission.findMany({
				where: {
					submitted: false
				},
				include: {
					Appeal: true
				}
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
	 * Get all document uploads for a submission
	 * @param {string} submissionId
	 * @returns {Promise<import('@prisma/client').SubmissionDocumentUpload[]>}
	 */
	async getSubmissionDocumentUploads(submissionId) {
		return this.dbClient.submissionDocumentUpload.findMany({
			where: { appellantSubmissionId: submissionId }
		});
	}

	/**
	 * Delete associated relations
	 * @param {string} submissionId
	 * @returns {Promise<void>}
	 */
	async deleteLinkedRecords(submissionId) {
		await this.dbClient.submissionDocumentUpload.deleteMany({
			where: { appellantSubmissionId: submissionId }
		});

		await this.dbClient.submissionAddress.deleteMany({
			where: { appellantSubmissionId: submissionId }
		});

		await this.dbClient.submissionLinkedCase.deleteMany({
			where: { appellantSubmissionId: submissionId }
		});

		await this.dbClient.submissionListedBuilding.deleteMany({
			where: { appellantSubmissionId: submissionId }
		});
	}

	/**
	 * Delete the submission
	 * @param {string} submissionId
	 * @returns {Promise<void>}
	 */
	async deleteSubmission(submissionId) {
		const submission = await this.dbClient.appellantSubmission.findUnique({
			where: { id: submissionId },
			select: { appealId: true }
		});

		const appealId = submission?.appealId;

		await this.dbClient.appealToUser.deleteMany({
			where: { appealId: appealId }
		});

		await this.dbClient.appellantSubmission.delete({
			where: { id: submissionId }
		});

		await this.dbClient.appeal.delete({
			where: { id: appealId }
		});
	}
};
