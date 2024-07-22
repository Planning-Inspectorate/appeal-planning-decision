const { getDocType, documentTypes } = require('./document-types');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('document-types.js', () => {
	describe('getDocType', () => {
		it('errors for unknown lookups', () => {
			expect(() => getDocType('unknown', 'name')).toThrow();
			expect(() => getDocType(null, 'name')).toThrow();
			expect(() => getDocType(undefined, 'name')).toThrow();
			expect(() => getDocType('', 'name')).toThrow();
			expect(() => getDocType(true, 'unknown')).toThrow();
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
