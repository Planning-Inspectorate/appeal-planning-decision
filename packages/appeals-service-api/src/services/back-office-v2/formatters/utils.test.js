const {
	toBool,
	getDocuments,
	formatAddresses,
	howYouNotifiedPeople,
	formatApplicationSubmissionUsers,
	formatApplicationDecision,
	formatYesNoSomeAnswer
} = require('./utils');
const { LPA_NOTIFICATION_METHODS } = require('@pins/common/src/database/data-static');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');
const { APPEAL_APPLICATION_DECISION, SERVICE_USER_TYPE } = require('pins-data-model');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { getDocType } = require('@pins/common/src/document-types');

jest.mock('@pins/common', () => ({
	initContainerClient: jest.fn()
}));
jest.mock('@pins/common/src/document-types', () => ({
	getDocType: jest.fn()
}));
jest.mock('../../object-store');
jest.mock('@pins/common/src/utils');
jest.mock('@pins/common/src/document-types');

describe('utils.js', () => {
	describe('toBool', () => {
		it('should return true for "yes"', () => {
			expect(toBool('yes')).toBe(true);
		});

		it('should return false for any other string', () => {
			expect(toBool('no')).toBe(false);
			expect(toBool('')).toBe(false);
			expect(toBool('anything')).toBe(false);
		});
	});

	describe('getDocuments', () => {
		it('should return formatted documents', async () => {
			const uploadDoc = {
				location: 'location1',
				storageId: 'id1',
				fileName: 'file1',
				originalFileName: 'originalFile1'
			};
			const metadataResult = {
				createdOn: '2023-10-16T00:00:00.000Z',
				metadata: {
					document_type: 'uploadApplicationDecisionLetter',
					size: '123',
					mime_type: 'application/pdf'
				},
				_response: { request: { url: 'http://example.com' } }
			};
			const mockDocType = {
				dataModelName: 'doc-type-test'
			};

			conjoinedPromises.mockResolvedValue(new Map([[uploadDoc, metadataResult]]));
			getDocType.mockReturnValue(mockDocType);
			const result = await getDocuments({ SubmissionDocumentUpload: [uploadDoc] }, 'test');

			expect(result).toEqual([
				{
					documentId: uploadDoc.storageId,
					filename: uploadDoc.fileName,
					originalFilename: uploadDoc.originalFileName,
					size: 123,
					mime: metadataResult.metadata.mime_type,
					documentURI: metadataResult._response.request.url,
					dateCreated: metadataResult.createdOn,
					documentType: mockDocType.dataModelName
				}
			]);
		});
	});

	describe('formatAddresses', () => {
		it('should format addresses correctly', () => {
			const addresses = [
				{ addressLine1: 'line1', addressLine2: 'line2', townCity: 'town', postcode: 'postcode' }
			];
			const result = formatAddresses(addresses);
			expect(result).toEqual([
				{ line1: 'line1', line2: 'line2', town: 'town', county: null, postcode: 'postcode' }
			]);
		});

		it('should return an empty array if addresses is null or undefined', () => {
			expect(formatAddresses(null)).toEqual([]);
			expect(formatAddresses(undefined)).toEqual([]);
		});
	});

	describe('howYouNotifiedPeople', () => {
		it('should return notification methods', () => {
			const answers = { notificationMethod: 'site-notice,letters-or-emails,advert' };
			const result = howYouNotifiedPeople(answers);
			expect(result).toEqual([
				LPA_NOTIFICATION_METHODS.notice.key,
				LPA_NOTIFICATION_METHODS.letter.key,
				LPA_NOTIFICATION_METHODS.pressAdvert.key
			]);
		});

		it('should return null if notificationMethod is not provided', () => {
			expect(howYouNotifiedPeople({})).toBeNull();
		});
	});

	describe('formatApplicationSubmissionUsers', () => {
		it('should format users correctly', () => {
			const data = {
				isAppellant: true,
				appellantFirstName: 'John',
				appellantLastName: 'Doe',
				appellantCompanyName: 'Company',
				contactFirstName: 'Jane',
				contactLastName: 'Smith',
				contactCompanyName: 'ContactCompany',
				contactPhoneNumber: '1234567890',
				Appeal: { Users: [{ AppealUser: { email: 'email@example.com' } }] }
			};
			const result = formatApplicationSubmissionUsers(data);
			expect(result).toEqual([
				{
					salutation: null,
					firstName: 'Jane',
					lastName: 'Smith',
					emailAddress: 'email@example.com',
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					telephoneNumber: '1234567890',
					organisation: 'ContactCompany'
				}
			]);
		});
	});

	describe('formatApplicationDecision', () => {
		it('should format application decision correctly', () => {
			expect(formatApplicationDecision(APPLICATION_DECISION.GRANTED)).toBe(
				APPEAL_APPLICATION_DECISION.GRANTED
			);
			expect(formatApplicationDecision(APPLICATION_DECISION.REFUSED)).toBe(
				APPEAL_APPLICATION_DECISION.REFUSED
			);
			expect(formatApplicationDecision('unknown')).toBe(APPEAL_APPLICATION_DECISION.NOT_RECEIVED);
		});
	});

	describe('formatYesNoSomeAnswer', () => {
		it('should format yes/no/some answers correctly', () => {
			expect(formatYesNoSomeAnswer('yes')).toBe('Yes');
			expect(formatYesNoSomeAnswer('no')).toBe('No');
			expect(formatYesNoSomeAnswer('some')).toBe('Some');
			expect(formatYesNoSomeAnswer('unknown')).toBeNull();
		});
	});
});
