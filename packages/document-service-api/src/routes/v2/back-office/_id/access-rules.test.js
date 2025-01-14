const { canAccessBODocument, CLIENT_CREDS_ROLE } = require('./access-rules');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { APPEAL_VIRUS_CHECK_STATUS } = require('pins-data-model');

const { documentTypes } = require('@pins/common/src/document-types');
const lpaOwnedDoc = documentTypes.conservationMap;
const appellantOwnedDoc = documentTypes.originalApplication;

const validDoc = {
	published: true,
	redacted: true,
	publiclyAccessible: true,
	virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.SCANNED,
	documentType: appellantOwnedDoc.dataModelName,
	AppealCase: {
		appealTypeCode: 'HAS'
	}
};

describe('v2/back-office/access-rules', () => {
	it('should return false if not scanned', () => {
		const options = {
			docMetaData: {
				...validDoc,
				virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.NOT_SCANNED
			},
			role: LPA_USER_ROLE
		};
		const options2 = {
			docMetaData: {
				...validDoc,
				virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.AFFECTED
			},
			role: APPEAL_USER_ROLES.APPELLANT
		};
		expect(canAccessBODocument(options)).toBe(false);
		expect(canAccessBODocument(options2)).toBe(false);
	});

	it('should return false if no role', () => {
		const options = { docMetaData: validDoc };
		expect(canAccessBODocument(options)).toBe(false);
	});

	it('should return false for LPA user if not published and not owner', () => {
		const options = {
			docMetaData: {
				...validDoc,
				published: false,
				documentType: appellantOwnedDoc.dataModelName
			},
			role: LPA_USER_ROLE
		};
		const options2 = {
			docMetaData: {
				...validDoc,
				redacted: false,
				documentType: appellantOwnedDoc.dataModelName
			},
			role: LPA_USER_ROLE
		};
		expect(canAccessBODocument(options)).toBe(false);
		expect(canAccessBODocument(options2)).toBe(false);
	});

	it('should return true for LPA user if not published but is owner', () => {
		const options = {
			docMetaData: {
				...validDoc,
				published: false,
				redacted: false,
				owner: LPA_USER_ROLE,
				documentType: lpaOwnedDoc.dataModelName
			},
			role: LPA_USER_ROLE
		};
		expect(canAccessBODocument(options)).toBe(true);
	});

	it('should return false for Appellant user if not published and not owner', () => {
		const options = {
			docMetaData: {
				...validDoc,
				published: false,
				documentType: lpaOwnedDoc.dataModelName
			},
			role: APPEAL_USER_ROLES.APPELLANT
		};
		const options2 = {
			docMetaData: {
				...validDoc,
				redacted: false,
				documentType: lpaOwnedDoc.dataModelName
			},
			role: APPEAL_USER_ROLES.APPELLANT
		};
		expect(canAccessBODocument(options)).toBe(false);
		expect(canAccessBODocument(options2)).toBe(false);
	});

	it('should return true for Agent user if not published but is owner', () => {
		const options = {
			docMetaData: {
				...validDoc,
				published: false,
				redacted: false
			},
			role: APPEAL_USER_ROLES.AGENT
		};
		expect(canAccessBODocument(options)).toBe(true);
	});

	it('should return true for Agent user if not published but is owner', () => {
		const options = {
			docMetaData: {
				...validDoc,
				published: false,
				redacted: false
			},
			role: APPEAL_USER_ROLES.AGENT
		};
		expect(canAccessBODocument(options)).toBe(true);
	});

	it('should return false for published doc + anon access', () => {
		const testDocType = 'publicAccessFalseTest';
		// todo: replace this once we have public docs in list
		documentTypes.test = {
			name: testDocType,
			owner: LPA_USER_ROLE,
			publiclyAccessible: false,
			dataModelName: testDocType
		};

		const options = {
			docMetaData: {
				...validDoc,
				documentType: testDocType
			},
			role: CLIENT_CREDS_ROLE
		};
		expect(canAccessBODocument(options)).toBe(false);
	});

	it('should return true for published doc + anon access', () => {
		const testDocType = 'publicAccessTrueTest';
		// todo: replace this once we have public docs in list
		documentTypes.test = {
			name: testDocType,
			owner: LPA_USER_ROLE,
			publiclyAccessible: true,
			dataModelName: testDocType
		};

		const options = {
			docMetaData: {
				...validDoc,
				documentType: testDocType
			},
			role: CLIENT_CREDS_ROLE
		};
		expect(canAccessBODocument(options)).toBe(true);
	});
});
