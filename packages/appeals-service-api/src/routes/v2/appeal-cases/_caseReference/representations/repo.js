const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').AppealCase} AppealCase
 * @typedef {import ('pins-data-model').Schemas.AppealRepresentation} AppealRepresentation
 */

/**
 * @param {AppealRepresentation} dataModel
 * @returns {RepresentationCreate}
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
	 * @returns {Promise<AppealCase|null>}
	 */
	async getAppealCaseWithAllRepresentations(caseReference) {
		try {
			// @ts-ignore
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				select: {
					caseReference: true,
					LPACode: true,
					applicationReference: true,
					caseProcedure: true,
					appealTypeCode: true,
					siteAddressLine1: true,
					siteAddressLine2: true,
					siteAddressTown: true,
					siteAddressCounty: true,
					siteAddressPostcode: true,
					Representations: {
						include: {
							RepresentationDocuments: true
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
	 * Get representations of a given type for a given case reference
	 *
	 * @param {string} caseReference
	 * @param {string} type
	 * @returns {Promise<AppealCase|null>}
	 */
	async getAppealCaseWithRepresentationsByType(caseReference, type) {
		try {
			// @ts-ignore
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				select: {
					LPACode: true,
					applicationReference: true,
					caseReference: true,
					caseProcedure: true,
					appealTypeCode: true,
					siteAddressLine1: true,
					siteAddressLine2: true,
					siteAddressTown: true,
					siteAddressCounty: true,
					siteAddressPostcode: true,
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
	 * Put a representation by representation id (ie BO id)
	 * @param {string} representationId
	 * @param {AppealRepresentation} data
	 * @returns {Promise<Representation>}
	 */
	async putRepresentationByRepresentationId(representationId, data) {
		const mappedData = mapRepresentationDataModelToRepresentation(data);

		const result = await this.dbClient.representation.upsert({
			create: {
				...mappedData,
				AppealCase: data.caseReference
					? { connect: { caseReference: data.caseReference } }
					: { create: {} }
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
						representationId
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
