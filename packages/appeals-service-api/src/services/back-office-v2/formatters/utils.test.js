const {
	toBool,
	getDocuments,
	formatAddresses,
	howYouNotifiedPeople,
	formatApplicationSubmissionUsers,
	formatApplicationDecision,
	formatYesNoSomeAnswer,
	createInterestedPartyNewUser,
	getDevelopmentType,
	getDesignatedSiteNames
} = require('./utils');
const { LPA_NOTIFICATION_METHODS } = require('@pins/common/src/database/data-static');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');
const {
	APPEAL_APPLICATION_DECISION,
	SERVICE_USER_TYPE,
	APPEAL_DEVELOPMENT_TYPE
} = require('@planning-inspectorate/data-model');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { getDocType } = require('@pins/common/src/document-types');
const { fieldValues } = require('@pins/common/src/dynamic-forms/field-values');

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

	describe('createInterestedPartyNewUser', () => {
		it('should return a formatted ip new user', () => {
			const data = {
				id: '123',
				caseReference: '987',
				firstName: 'Testy',
				lastName: 'McTest',
				addressLine1: null,
				addressLine2: null,
				townCity: null,
				county: null,
				postcode: null,
				emailAddress: 'testEmail@test.com',
				comments: 'some test comments',
				createdAt: new Date(),
				AppealCase: { LPACode: 'test456', appealTypeCode: 'S78' }
			};
			const result = createInterestedPartyNewUser(data);
			expect(result).toEqual({
				salutation: null,
				firstName: 'Testy',
				lastName: 'McTest',
				emailAddress: 'testEmail@test.com',
				serviceUserType: SERVICE_USER_TYPE.INTERESTED_PARTY,
				telephoneNumber: null,
				organisation: null
			});
		});

		it('should return include provided address for formatted ip new user', () => {
			const data = {
				id: '123',
				caseReference: '987',
				firstName: 'Testy',
				lastName: 'McTest',
				addressLine1: 'test',
				addressLine2: 'test2',
				townCity: 'test3',
				county: 'test4',
				postcode: 'test5',
				emailAddress: 'testEmail@test.com',
				comments: 'some test comments',
				createdAt: new Date(),
				AppealCase: { LPACode: 'test456', appealTypeCode: 'S78' }
			};
			const result = createInterestedPartyNewUser(data);
			expect(result).toEqual({
				salutation: null,
				firstName: 'Testy',
				lastName: 'McTest',
				emailAddress: 'testEmail@test.com',
				serviceUserType: SERVICE_USER_TYPE.INTERESTED_PARTY,
				telephoneNumber: null,
				organisation: null,
				addressLine1: data.addressLine1,
				addressLine2: data.addressLine2,
				addressTown: data.townCity,
				addressCounty: data.county,
				addressPostcode: data.postcode
			});
		});
	});

	describe('getDevelopmentType', () => {
		it('should return null if typeDevelopment is not provided', () => {
			const appellantSubmission = {};
			expect(getDevelopmentType(appellantSubmission)).toBeNull();
		});

		it('should return HOUSEHOLDER for HOUSEHOLDER typeDevelopment', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.HOUSEHOLDER
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(APPEAL_DEVELOPMENT_TYPE.HOUSEHOLDER);
		});

		it('should return CHANGE_OF_USE for CHANGE_OF_USE typeDevelopment', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.CHANGE_OF_USE
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(APPEAL_DEVELOPMENT_TYPE.CHANGE_OF_USE);
		});

		it('should return MINERAL_WORKINGS for MINERAL_WORKINGS typeDevelopment', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.MINERAL_WORKINGS
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(
				APPEAL_DEVELOPMENT_TYPE.MINERAL_WORKINGS
			);
		});

		it('should return MAJOR_DWELLINGS for DWELLINGS typeDevelopment and major development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.DWELLINGS,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MAJOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(APPEAL_DEVELOPMENT_TYPE.MAJOR_DWELLINGS);
		});

		it('should return MINOR_DWELLINGS for DWELLINGS typeDevelopment and minor development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.DWELLINGS,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MINOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(APPEAL_DEVELOPMENT_TYPE.MINOR_DWELLINGS);
		});

		it('should return MAJOR_INDUSTRY_STORAGE for INDUSTRY_STORAGE typeDevelopment and major development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.INDUSTRY_STORAGE,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MAJOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(
				APPEAL_DEVELOPMENT_TYPE.MAJOR_INDUSTRY_STORAGE
			);
		});

		it('should return MINOR_INDUSTRY_STORAGE for INDUSTRY_STORAGE typeDevelopment and minor development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.INDUSTRY_STORAGE,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MINOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(
				APPEAL_DEVELOPMENT_TYPE.MINOR_INDUSTRY_STORAGE
			);
		});

		it('should return MAJOR_OFFICES for OFFICES typeDevelopment and major development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.OFFICES,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MAJOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(APPEAL_DEVELOPMENT_TYPE.MAJOR_OFFICES);
		});

		it('should return MINOR_OFFICES for OFFICES typeDevelopment and minor development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.OFFICES,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MINOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(APPEAL_DEVELOPMENT_TYPE.MINOR_OFFICES);
		});

		it('should return MAJOR_RETAIL_SERVICES for RETAIL_SERVICES typeDevelopment and major development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.RETAIL_SERVICES,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MAJOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(
				APPEAL_DEVELOPMENT_TYPE.MAJOR_RETAIL_SERVICES
			);
		});

		it('should return MINOR_RETAIL_SERVICES for RETAIL_SERVICES typeDevelopment and minor development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.RETAIL_SERVICES,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MINOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(
				APPEAL_DEVELOPMENT_TYPE.MINOR_RETAIL_SERVICES
			);
		});

		it('should return MAJOR_TRAVELLER_CARAVAN for TRAVELLER_CARAVAN typeDevelopment and major development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.TRAVELLER_CARAVAN,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MAJOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(
				APPEAL_DEVELOPMENT_TYPE.MAJOR_TRAVELLER_CARAVAN
			);
		});

		it('should return MINOR_TRAVELLER_CARAVAN for TRAVELLER_CARAVAN typeDevelopment and minor development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.TRAVELLER_CARAVAN,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MINOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(
				APPEAL_DEVELOPMENT_TYPE.MINOR_TRAVELLER_CARAVAN
			);
		});

		it('should return OTHER_MAJOR for OTHER typeDevelopment and major development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.OTHER,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MAJOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(APPEAL_DEVELOPMENT_TYPE.OTHER_MAJOR);
		});

		it('should return OTHER_MINOR for OTHER typeDevelopment and minor development', () => {
			const appellantSubmission = {
				typeDevelopment: fieldValues.applicationAbout.OTHER,
				majorMinorDevelopment: fieldValues.majorMinorDevelopment.MINOR
			};
			expect(getDevelopmentType(appellantSubmission)).toBe(APPEAL_DEVELOPMENT_TYPE.OTHER_MINOR);
		});

		it('should throw an error for unhandled developmentType', () => {
			const appellantSubmission = {
				typeDevelopment: 'UNHANDLED_TYPE'
			};
			expect(() => getDevelopmentType(appellantSubmission)).toThrow('unhandled developmentType');
		});
	});

	describe('getDesignatedSiteNames', () => {
		it('should return empty array if designatedSites is nullish', () => {
			let answers = {};
			expect(getDesignatedSiteNames(answers)).toEqual([]);
			answers = { designatedSites: null };
			expect(getDesignatedSiteNames(answers)).toEqual([]);
			answers = { designatedSites: undefined };
			expect(getDesignatedSiteNames(answers)).toEqual([]);
			answers = { designatedSites: '' };
			expect(getDesignatedSiteNames(answers)).toEqual([]);
			answers = { designatedSites: 0 };
			expect(getDesignatedSiteNames(answers)).toEqual([]);
		});

		it("should return empty array if designatedSites is 'None'", () => {
			const answers = { designatedSites: 'None' };
			expect(getDesignatedSiteNames(answers)).toEqual([]);
		});

		it('should return empty array if designatedSites is nullish even with designatedSites_otherDesignations specified', () => {
			const answers = { designatedSites: '', designatedSites_otherDesignations: 'something' };
			expect(getDesignatedSiteNames(answers)).toEqual([]);
		});

		it('should return array of sites if designatedSites is a comma-separated string', () => {
			const answers = { designatedSites: 'A,B Test' };
			expect(getDesignatedSiteNames(answers)).toEqual(['A', 'B Test']);
		});

		it('should include otherDesignations if provided', () => {
			const answers = { designatedSites: 'A,B', designatedSites_otherDesignations: 'C' };
			expect(getDesignatedSiteNames(answers)).toEqual(['A', 'B', 'C']);
		});

		it('should filter out empty otherDesignations', () => {
			const answers = { designatedSites: 'SPA,', designatedSites_otherDesignations: '' };
			expect(getDesignatedSiteNames(answers)).toEqual(['SPA']);
		});
	});
});
