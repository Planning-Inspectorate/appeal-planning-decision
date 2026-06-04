const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client/client');
const { dashboardSelect, DocumentsArgsPublishedOnly, DocumentsArgs } = require('../../repo');
const {
	APPEAL_REPRESENTATION_TYPE,
	APPEAL_DOCUMENT_TYPE
} = require('@planning-inspectorate/data-model');

const ApiError = require('#errors/apiError');

/**
 * @typedef {import('@pins/database/src/client/client').AppealCase} AppealCase
 * @typedef {import('@pins/database/src/client/client').Representation} Representation
 * @typedef {import('@pins/database/src/client/client').Document} Document
 * @typedef {AppealCase & { Representations?: Array.<Representation>} & { Documents?: Array.<Document>}} AppealWithRepresentations
 *
 * @typedef {import ('@planning-inspectorate/data-model').Schemas.AppealRepresentation} AppealRepresentation
 */

/**
 * @param {AppealRepresentation} dataModel
 * @returns {import('@pins/database/src/client/client').Prisma.RepresentationCreateWithoutAppealCaseInput}
 */
const mapRepresentationDataModelToRepresentation = ({
	representationId,
	caseId,
	representationStatus,
	originalRepresentation,
	redacted,
	redactedRepresentation,
	redactedBy,
	invalidOrIncompleteDetails,
	otherInvalidOrIncompleteDetails,
	source,
	serviceUserId,
	representationType,
	dateReceived
}) => ({
	representationId,
	caseId,
	representationStatus,
	originalRepresentation,
	redacted,
	redactedRepresentation,
	redactedBy,
	invalidOrIncompleteDetails: invalidOrIncompleteDetails
		? JSON.stringify(invalidOrIncompleteDetails)
		: null,
	otherInvalidOrIncompleteDetails: otherInvalidOrIncompleteDetails
		? JSON.stringify(otherInvalidOrIncompleteDetails)
		: null,
	source,
	serviceUserId,
	representationType,
	dateReceived
});

class RepresentationsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get all representations for a given case reference
	 *
	 * @param {string} caseReference
	 * @returns {Promise<AppealWithRepresentations|null>}
	 */
	async getAppealCaseWithAllRepresentations(caseReference) {
		try {
			const [appealCase, documents] = await Promise.all([
				this.dbClient.appealCase.findUnique({
					where: {
						caseReference
					},
					select: {
						...dashboardSelect,
						Representations: {
							select: {
								source: true,
								serviceUserId: true,
								representationType: true,
								representationStatus: true,
								dateReceived: true
							}
						}
					}
				}),
				this.dbClient.document.findMany({
					...DocumentsArgs,
					where: {
						caseReference: caseReference,
						documentType: {
							in: [
								// decision
								APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER,

								// lpa costs
								APPEAL_DOCUMENT_TYPE.LPA_COSTS_APPLICATION,
								APPEAL_DOCUMENT_TYPE.LPA_COSTS_CORRESPONDENCE,
								APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER,
								// APPEAL_DOCUMENT_TYPE.LPA_COSTS_WITHDRAWAL,

								// appellant costs
								APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
								APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_CORRESPONDENCE,
								APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER
								// APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_WITHDRAWAL
							]
						}
					}
				})
			]);

			if (!appealCase) {
				return null;
			}

			return {
				...appealCase,
				Documents: documents
			};
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Get representations of a given type for a given case reference
	 *
	 * @param {string} caseReference
	 * @param {string} type
	 * @returns {Promise<AppealCase|null>}
	 */
	async getAppealCaseWithRepresentationsByType(caseReference, type) {
		/** @type {string[]} */
		let documentTypes = [];

		switch (type) {
			case APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT:
				documentTypes.push(
					APPEAL_DOCUMENT_TYPE.APPELLANT_FINAL_COMMENT,
					APPEAL_DOCUMENT_TYPE.LPA_FINAL_COMMENT
				);
				break;
			case APPEAL_REPRESENTATION_TYPE.STATEMENT:
				documentTypes.push(
					APPEAL_DOCUMENT_TYPE.APPELLANT_STATEMENT,
					APPEAL_DOCUMENT_TYPE.LPA_STATEMENT,
					APPEAL_DOCUMENT_TYPE.RULE_6_STATEMENT
				);
				break;
			case APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE:
				documentTypes.push(
					APPEAL_DOCUMENT_TYPE.APPELLANT_PROOF_OF_EVIDENCE,
					APPEAL_DOCUMENT_TYPE.LPA_PROOF_OF_EVIDENCE,
					APPEAL_DOCUMENT_TYPE.RULE_6_PROOF_OF_EVIDENCE
				);
				break;
			case APPEAL_REPRESENTATION_TYPE.COMMENT:
				documentTypes.push(APPEAL_DOCUMENT_TYPE.INTERESTED_PARTY_COMMENT);
				break;
			default:
				throw new Error('unknown doc type for representation type');
		}

		try {
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				select: {
					...dashboardSelect,
					Documents: {
						...DocumentsArgsPublishedOnly,
						where: {
							...DocumentsArgsPublishedOnly.where,
							documentType: {
								in: documentTypes
							}
						}
					},
					Representations: {
						where: {
							representationType: type
						},
						include: {
							RepresentationDocuments: {
								select: {
									documentId: true
								}
							}
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Put a representation by representation id (ie BO id)
	 * @param {string} representationId
	 * @param {AppealRepresentation} data
	 * @returns {Promise<Representation>}
	 */
	async putRepresentationByRepresentationId(representationId, data) {
		if (!data.caseReference) {
			throw ApiError.appealsCaseDataNotFound();
		}

		const mappedData = mapRepresentationDataModelToRepresentation(data);

		const result = await this.dbClient.representation.upsert({
			create: {
				...mappedData,
				AppealCase: { connect: { caseReference: data.caseReference } }
			},
			update: {
				...mappedData,
				AppealCase: { connect: { caseReference: data.caseReference } }
			},
			where: {
				representationId
			}
		});

		if (data.documentIds?.length) {
			await this.dbClient.$transaction(async (tx) => {
				// delete all relations that use this case
				await tx.representationDocument.deleteMany({
					where: {
						representationId: result.id
					}
				});

				await tx.representationDocument.createMany({
					data: data.documentIds.map((documentId) => ({
						representationId: result.id,
						documentId
					}))
				});
			});
		}

		return result;
	}
}

module.exports = { RepresentationsRepository };
