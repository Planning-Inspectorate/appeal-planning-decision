const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').AppealCase} AppealCase
 * @typedef {import ('pins-data-model').Schemas.AppealRepresentation} AppealRepresentation
 */

// /**
//  * @param {AppealRepresentation} dataModel
//  * @returns {RepresentationCreate}
//  */
// const mapRepresentationDataModelToRepresentation = (
// 	{
// 		...commonFields
// 	}
// ) => ({

// });

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
							RepresentationDocuments: {
								include: {
									Document: true
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
							RepresentationDocuments: {
								include: {
									Document: true
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

	// /**
	//  * Put a representation by representation id (ie BO id)
	//  * @param {string} representationId
	//  * @param {AppealRepresentation} data
	//  * @returns {Promise<Representation>}
	//  */
	// async putRepresentationByRepresentationId(representationId, data) {
	// 	// const mappedData = mapRepresentationDataModelToRepresentation(data);

	// 	const result = await this.dbClient.representation.upsert({
	// 		create: {
	// 			// ...mappedData,
	// 			AppealCase: data.caseReference ? { connect: { caseReference: data.caseReference } } : { create: {} }
	// 		},
	// 		update: mappedData,
	// 		where: {
	// 			representationId
	// 		}
	// 	});

	// 	// case relations
	// 	// nearby cases are referenced both ways
	// 	// lead/child are only reference from child(1) to lead(2)
	// 	await this.dbClient.$transaction(async (tx) => {
	// 		// delete all relations that use this case
	// 		await tx.representationDocument.deleteMany({
	// 			where: {
	// 				representationId
	// 			}
	// 		});

	// 		// add nearby references both ways
	// 		if (data.documentIds?.length) {
	// 			const direction1 = data.documentIds.map((documentId
	// 			) => ({
	// 				caseReference: caseReference,
	// 				caseReference2: nearby
	// 			}));
	// 			const direction2 = data.nearbyCaseReferences.map((nearby) => ({
	// 				caseReference: nearby,
	// 				caseReference2: caseReference
	// 			}));

	// 			await tx.appealCaseRelationship.createMany({
	// 				data: direction1.concat(direction2)
	// 			});
	// 		}

	// 		// add lead case (only referenced from child(1) -> lead(2))
	// 		if (data.leadCaseReference) {
	// 			await tx.appealCaseRelationship.create({
	// 				data: {
	// 					caseReference,
	// 					caseReference2: data.leadCaseReference,
	// 					type: CASE_RELATION_TYPES.linked
	// 				}
	// 			});
	// 		}
	// 	});

	// 	// neighbour addresses
	// 	await this.dbClient.$transaction(async (tx) => {
	// 		// delete all of the existing neighbouringAddresses
	// 		await tx.neighbouringAddress.deleteMany({
	// 			where: {
	// 				caseReference: caseReference
	// 			}
	// 		});

	// 		// add all
	// 		if (data.neighbouringSiteAddresses?.length) {
	// 			await tx.neighbouringAddress.createMany({
	// 				data: data.neighbouringSiteAddresses.map((address) => ({
	// 					caseReference,
	// 					addressLine1: address.neighbouringSiteAddressLine1,
	// 					addressLine2: address.neighbouringSiteAddressLine2,
	// 					townCity: address.neighbouringSiteAddressTown,
	// 					county: address.neighbouringSiteAddressCounty,
	// 					postcode: address.neighbouringSiteAddressPostcode,
	// 					postcodeSanitized: sanitizePostcode(address.neighbouringSiteAddressPostcode),
	// 					siteAccessDetails: address.neighbouringSiteAccessDetails,
	// 					siteSafetyDetails: address.neighbouringSiteSafetyDetails
	// 				}))
	// 			});
	// 		}
	// 	});

	// 	return result;
	// }
}

module.exports = { RepresentationsRepository };
