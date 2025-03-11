/**
 * @param {string} representationId
 * @param {string} caseReference
 * @param {'statement' | 'comment' | 'final_comment' | 'proofs_evidence' | null} representationType
 * @param {'lpa' | 'citizen' | null} source
 * @returns {import('pins-data-model/src/schemas').AppealRepresentation}
 */
function createTestRepresentationPayload(
	representationId,
	caseReference,
	representationType,
	source = 'lpa'
) {
	return {
		representationId,
		caseId: null,
		caseReference,
		representationStatus: 'published',
		originalRepresentation: 'a test blurb',
		redacted: false,
		redactedRepresentation: null,
		redactedBy: null,
		invalidOrIncompleteDetails: null,
		otherInvalidOrIncompleteDetails: null,
		source,
		serviceUserId: null,
		representationType,
		dateReceived: new Date(),
		documentIds: ['01956ca1-1213-7107-a4ab-be56f597485d']
	};
}

module.exports = { createTestRepresentationPayload };
