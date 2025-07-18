const { canAccessBODocument, checkDocAccess, CLIENT_CREDS_ROLE } = require('./document-access');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { APPEAL_VIRUS_CHECK_STATUS } = require('@planning-inspectorate/data-model');

const { documentTypes } = require('@pins/common/src/document-types');
const lpaOwnedDoc = documentTypes.conservationMap;
const appellantOwnedDoc = documentTypes.originalApplication;
const rule6OwnedDoc = documentTypes.uploadRule6StatementDocuments;

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

const mockLogger = {
	warn: jest.fn(),
	error: jest.fn(),
	info: jest.fn(),
	debug: jest.fn()
};

describe('v2/back-office/access-rules', () => {
	describe('canAccessBODocument', () => {
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

		it('should return true for Rule 6 user if not published but is owner', () => {
			const options = {
				docMetaData: {
					...validDoc,
					published: false,
					redacted: false,
					documentType: rule6OwnedDoc.dataModelName
				},
				role: APPEAL_USER_ROLES.RULE_6_PARTY
			};
			expect(canAccessBODocument(options)).toBe(true);
		});

		it('should return true for Rule 6 user if not published but is owner', () => {
			const options = {
				docMetaData: {
					...validDoc
				},
				role: APPEAL_USER_ROLES.RULE_6_PARTY
			};
			expect(canAccessBODocument(options)).toBe(true);
		});

		it('should return false for non public published doc + anon access', () => {
			const testDocType = 'publicAccessFalseTest';
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

		it('should return true for public published doc + anon access', () => {
			const testDocType = 'publicAccessTrueTest';
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

		it('should return false for unknown doc type', () => {
			const options = {
				docMetaData: {
					...validDoc,
					documentType: 'unknown'
				},
				role: CLIENT_CREDS_ROLE
			};
			expect(canAccessBODocument(options)).toBe(false);
		});
	});

	describe('checkDocAccess', () => {
		const docWithAppeal = {
			...validDoc,
			publiclyAccessible: false,
			AppealCase: {
				LPACode: 'Q1111',
				appealId: '123',
				appealTypeCode: 'HAS'
			}
		};
		const userId = '123';
		const access_tk = { sub: userId };

		it('should return false if no access token', () => {
			expect(
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: [],
					access_token: null,
					id_token: {}
				})
			).toBe(false);
		});

		it('should return false with client creds', () => {
			const roles = [];
			expect(
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: roles,
					access_token: access_tk,
					id_token: null
				})
			).toBe(false);
		});

		it('should return true if LPA has access', () => {
			const roles = [];
			const id_tk = { sub: userId, lpaCode: docWithAppeal.AppealCase.LPACode };
			expect(
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: roles,
					access_token: access_tk,
					id_token: id_tk
				})
			).toBe(true);
		});

		it('should return false if wrong LPA', () => {
			const roles = [];
			const id_tk = { sub: userId, lpaCode: 'nope' };
			expect(
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: roles,
					access_token: access_tk,
					id_token: id_tk
				})
			).toBe(false);
		});

		it('should return false if no role', () => {
			expect(
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: [],
					access_token: access_tk,
					id_token: {}
				})
			).toBe(false);
		});

		it('should return true if appellant has access', () => {
			const roles = [{ role: APPEAL_USER_ROLES.APPELLANT }];
			const id_tk = { sub: userId };
			expect(
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: roles,
					access_token: access_tk,
					id_token: id_tk
				})
			).toBe(true);
		});

		it('should return true if agent has access', () => {
			const roles = [{ role: APPEAL_USER_ROLES.AGENT }];
			const id_tk = { sub: userId };
			expect(
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: roles,
					access_token: access_tk,
					id_token: id_tk
				})
			).toBe(true);
		});

		it('should return true if rule 6 has access', () => {
			const roles = [{ role: APPEAL_USER_ROLES.RULE_6_PARTY }];
			const id_tk = { sub: userId };
			expect(
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: roles,
					access_token: access_tk,
					id_token: id_tk
				})
			).toBe(true);
		});

		it('should error if unknown role', () => {
			const roles = [{ role: 'nope' }];
			const id_tk = { sub: userId };
			expect(() =>
				checkDocAccess({
					logger: mockLogger,
					documentWithAppeal: docWithAppeal,
					appealUserRoles: roles,
					access_token: access_tk,
					id_token: id_tk
				})
			).toThrow();
		});
	});
});
