const { createPrismaClient } = require('../db-client');
const { APPEAL_USER_ROLES, REPRESENTATION_TYPES } = require('@pins/common/src/constants');
const {
	addOwnershipAndSubmissionDetailsToRepresentations
} = require('@pins/common/src/access/representation-ownership');

/**
 * @typedef {import('@pins/database/src/client/client').Representation} Representation
 * @typedef {import('@pins/database/src/client/client').ServiceUser} ServiceUser
 * @typedef {Pick<ServiceUser, 'id' | 'emailAddress' | 'serviceUserType'>} BasicServiceUser
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef { 'LPAUser' } LpaUserRole
 * @typedef { {
 *   serviceUserId: string|null,
 *   representationType: string|null,
 *   representationStatus: string|null,
 * 	 source: string|null
 *   RepresentationDocuments: {documentId: string}[]
 * } } RepresentationWithDocuments
 * @typedef { RepresentationWithDocuments & {
 *   userOwnsRepresentation: boolean,
 *   submittingPartyType: AppealToUserRoles | LpaUserRole | undefined
 * }} RepresentationWithDocumentsAndOwnership
 * @typedef { {
 *   representationStatus: string|null,
 *   documentId: string,
 *   userOwnsRepresentation: boolean,
 *   submittingPartyType: string | undefined
 * } } FlatRepDocOwnership
 */

const logger = require('#lib/logger');

class DocumentsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {string} id SubmissionDocumentUpload id
	 * @returns {Promise<import('@pins/database/src/client/client').SubmissionDocumentUpload & { LPAQuestionnaireSubmission: { appealCaseReference: string} }>} documentWithAppeal
	 */
	async getSubmissionDocument(id) {
		return this.dbClient.submissionDocumentUpload.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				location: true,
				originalFileName: true,
				appellantSubmissionId: true,
				LPAQuestionnaireSubmission: {
					select: {
						appealCaseReference: true
					}
				}
			}
		});
	}

	/**
	 * @param {string} caseRef
	 * @returns {Promise<Array<{location: string, type: string, originalFileName: string }>>} documents
	 */
	async getSubmissionDocumentsByCaseRef(caseRef) {
		return this.dbClient.submissionDocumentUpload.findMany({
			where: {
				LPAQuestionnaireSubmission: {
					appealCaseReference: caseRef
				}
			},
			select: {
				location: true,
				type: true,
				originalFileName: true
			}
		});
	}

	/**
	 * @param {string} id SubmissionDocumentUpload id
	 * @return {Promise<import('@pins/database/src/client/client').SubmissionDocumentUpload>}
	 */
	async deleteSubmissionDocument(id) {
		return this.dbClient.submissionDocumentUpload.delete({
			where: {
				id
			}
		});
	}

	/**
	 * @param {string} lookup document lookup, id or uri
	 * @return {Promise<import('@pins/database/src/client/client').Document & { AppealCase: { LPACode:string, appealId: string, appealTypeCode: string} }>}
	 */
	async getDocumentWithAppeal(lookup) {
		return await this.dbClient.document.findFirstOrThrow({
			where: this.#getDocumentLookupQuery(lookup),
			include: {
				AppealCase: {
					select: {
						LPACode: true,
						appealId: true,
						appealTypeCode: true
					}
				}
			}
		});
	}

	/**
	 *
	 * @param {object} params
	 * @param {string} params.documentType
	 * @param {string} params.caseReference
	 * @returns {Promise<import('@pins/database/src/client/client').Document[]>}
	 */
	async getDocuments({ documentType, caseReference }) {
		if (!caseReference) throw new Error('caseReference required');

		return await this.dbClient.document.findMany({
			where: {
				documentType: documentType,
				caseReference: caseReference
			}
		});
	}

	/**
	 * Get documents by multiple types for a single caseReference
	 * @param {object} params
	 * @param {string[]} params.documentTypes
	 * @param {string} params.caseReference
	 * @param {string} params.stage
	 * @returns {Promise<import('@pins/database/src/client/client').Document[]>}
	 */
	async getDocumentsByTypes({ documentTypes, caseReference, stage }) {
		if (!caseReference) throw new Error('caseReference required');
		if (!Array.isArray(documentTypes) || !documentTypes.length)
			throw new Error('documentTypes required');

		return await this.dbClient.document.findMany({
			where: {
				documentType: { in: documentTypes },
				caseReference: caseReference,
				stage: stage
			}
		});
	}

	/**
	 * @param {object} params
	 * @param {string} params.caseReference
	 * @param {string} params.email
	 * @param {boolean} params.isLpa
	 * @returns {Promise<FlatRepDocOwnership[]>}
	 */
	async getRepresentationDocsByCaseReference({ caseReference, email, isLpa }) {
		if (!caseReference) throw new Error('caseReference required');

		const representations = await this.dbClient.representation.findMany({
			where: {
				caseReference: caseReference
			},
			select: {
				serviceUserId: true,
				representationStatus: true,
				source: true,
				representationType: true,
				RepresentationDocuments: {
					select: {
						documentId: true
					}
				}
			}
		});

		// get unique list of service user ids for any non-ip comment representations
		// ip comments are ignored as they have no associated login and so ownership always false
		const serviceUserIds = new Set(
			representations
				.filter(
					(rep) =>
						rep.serviceUserId &&
						rep.representationType !== REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
				)
				.map((rep) => rep.serviceUserId)
				.filter(Boolean)
		);

		const serviceUsersWithEmails = await this.getServiceUsersWithEmailsByIdAndCaseReference(
			[...serviceUserIds],
			caseReference
		);

		const withOwnership = addOwnershipAndSubmissionDetailsToRepresentations(
			representations,
			email,
			isLpa,
			serviceUsersWithEmails
		);

		return withOwnership.flatMap((rep) =>
			rep.RepresentationDocuments.map((doc) => ({
				documentId: doc.documentId,
				userOwnsRepresentation: rep.userOwnsRepresentation,
				submittingPartyType: rep.submittingPartyType,
				representationStatus: rep.representationStatus
			}))
		);
	}

	/**
	 * Get service user emails by array of ids
	 *
	 * @param {string[]} serviceUserIds
	 * @param {string} caseReference
	 * @returns {Promise<BasicServiceUser[]>|[]}
	 */
	getServiceUsersWithEmailsByIdAndCaseReference(serviceUserIds, caseReference) {
		if (!caseReference || !serviceUserIds || serviceUserIds.length === 0) return [];

		return this.dbClient.serviceUser.findMany({
			where: {
				AND: {
					id: {
						in: serviceUserIds
					},
					caseReference
				}
			},
			select: {
				id: true,
				emailAddress: true,
				serviceUserType: true
			}
		});
	}

	/**
	 * @param {Object} params
	 * @param {string} params.caseReference
	 * @returns {Promise<{ appealId: string, LPACode: string }|null>}
	 */
	async getAppealCase({ caseReference }) {
		return await this.dbClient.appealCase.findFirst({
			where: {
				caseReference
			},
			select: {
				appealId: true,
				LPACode: true,
				appealTypeCode: true
			}
		});
	}

	/**
	 * @param {Object} params
	 * @param {string} params.appealId
	 * @param {string} params.userId
	 * @returns {Promise<import('@pins/database/src/client/client').AppealToUser[]>}
	 */
	async getAppealUserRoles({ appealId, userId }) {
		return await this.dbClient.appealToUser.findMany({
			where: {
				appealId,
				userId
			},
			select: {
				appealId: true,
				userId: true,
				role: true
			}
		});
	}

	/**
	 * @param {{ caseReference: string, userLpa: string }} params
	 * @returns {Promise<boolean>}
	 */
	async lpaCanModifyCase({ caseReference, userLpa }) {
		try {
			await this.dbClient.appealCase.findUniqueOrThrow({
				where: {
					caseReference,
					LPACode: userLpa
				},
				select: {
					id: true
				}
			});

			return true;
		} catch (err) {
			logger.error({ err }, 'invalid user access');
			throw new Error(`${userLpa} does not have access to case: ${caseReference}`);
		}
	}

	/**
	 * @param {{ appellantSubmissionId: string, userId: string }} params
	 * @returns {Promise<boolean>}
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
				throw new Error('Forbidden');
			}

			return true;
		} catch (err) {
			logger.error({ err }, 'invalid user access');
			throw new Error('Forbidden');
		}
	}

	/**
	 * document lookup, can be blob storage uri or an id
	 * @param {string} documentLookup
	 * @returns {import('@pins/database/src/client/client').Prisma.DocumentWhereUniqueInput}
	 */
	#getDocumentLookupQuery(documentLookup) {
		/** @type {import('@pins/database/src/client/client').Prisma.DocumentWhereUniqueInput} */
		let where = {};
		if (documentLookup.includes('http')) {
			where.documentURI = documentLookup;
		} else {
			where.id = documentLookup;
		}
		return where;
	}
}

module.exports = { DocumentsRepository };
