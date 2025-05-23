const { getDocType, documentTypes } = require('./document-types');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('document-types.js', () => {
	describe('getDocType', () => {
		it('returns null for unknown lookups', () => {
			expect(getDocType('unknown', 'name')).toEqual(null);
			expect(getDocType(null, 'name')).toEqual(null);
			expect(getDocType(undefined, 'name')).toEqual(null);
			expect(getDocType('', 'name')).toEqual(null);
			expect(getDocType(true, 'unknown')).toEqual(null);
		});

		it('returns doc type for name', () => {
			const result = getDocType('uploadOwnershipCertificate', 'name');
			expect(result).toBe(documentTypes.uploadOwnershipCertificate);
		});

		it('returns doc type for dataModelName', () => {
			const result = getDocType(APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION, 'dataModelName');
			expect(result).toBe(documentTypes.uploadCostApplication);
		});

		it('returns first match of prop', () => {
			const result = getDocType(true, 'multiple');
			expect(result).toBe(documentTypes.otherDocuments);
		});
	});
});
