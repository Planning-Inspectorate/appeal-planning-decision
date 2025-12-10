const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client/client');
const { dashboardSelect, DocumentsArgsPublishedOnly } = require('../../repo');
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
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				select: {
					...dashboardSelect,
					Documents: { ...DocumentsArgsPublishedOnly },
					Representations: {
						include: {
							RepresentationDocuments: true
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
	 * Get representations of a given type for a given case reference
	 *
	 * @param {string} caseReference
	 * @param {string} type
	 * @returns {Promise<AppealCase|null>}
	 */
	async getAppealCaseWithRepresentationsByType(caseReference, type) {
		try {
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				select: {
					...dashboardSelect,
					Documents: { ...DocumentsArgsPublishedOnly },
					Representations: {
						where: {
							representationType: type
						},
						include: {
							RepresentationDocuments: true
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
			update: mappedData,
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
