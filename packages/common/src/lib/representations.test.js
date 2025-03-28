const { LPA_USER_ROLE } = require('../constants');
const {
	representationExists,
	representationPublished,
	getRepresentationSubmissionDate
} = require('./representations');
const { APPEAL_REPRESENTATION_STATUS, SERVICE_USER_TYPE } = require('pins-data-model');

describe('representationExists', () => {
	it('should return true if representation exists with the given type and ownership', () => {
		const representations = [
			{
				representationType: 'type1',
				userOwnsRepresentation: true,
				submittingPartyType: SERVICE_USER_TYPE.APPELLANT
			},
			{
				representationType: 'type2',
				userOwnsRepresentation: false,
				submittingPartyType: SERVICE_USER_TYPE.APPELLANT
			}
		];
		expect(
			representationExists(representations, {
				type: 'type1',
				owned: true,
				submitter: SERVICE_USER_TYPE.APPELLANT
			})
		).toBe(true);
	});

	it('should return false if no representation exists with the given type and ownership', () => {
		const representations = [
			{ representationType: 'type1', userOwnsRepresentation: false },
			{ representationType: 'type2', userOwnsRepresentation: false }
		];
		expect(representationExists(representations, { type: 'type1', owned: true })).toBe(false);
	});

	it('should return true if representation exists with the given type regardless of ownership', () => {
		const representations = [
			{ representationType: 'type1', userOwnsRepresentation: false },
			{ representationType: 'type2', userOwnsRepresentation: false }
		];
		expect(representationExists(representations, { type: 'type1', owned: false })).toBe(true);
		expect(representationExists(representations, { type: 'type1' })).toBe(true);
	});

	it('should return false if representations array is undefined', () => {
		expect(representationExists(undefined, { type: 'type1' })).toBe(false);
	});
});

describe('representationPublished', () => {
	it('should return true if published representation exists with the given type and submitter', () => {
		const representations = [
			{
				representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
				userOwnsRepresentation: false,
				representationType: 'type1',
				submittingPartyType: SERVICE_USER_TYPE.APPELLANT
			}
		];
		expect(
			representationPublished(representations, {
				type: 'type1',
				submitter: SERVICE_USER_TYPE.APPELLANT
			})
		).toBe(true);
	});

	it('should return false if no published representation exists with the given type and submitter', () => {
		const representations = [
			{
				representationStatus: APPEAL_REPRESENTATION_STATUS.DRAFT,
				userOwnsRepresentation: false,
				representationType: 'type1',
				submittingPartyType: SERVICE_USER_TYPE.APPELLANT
			}
		];
		expect(
			representationPublished(representations, {
				type: 'type1',
				submitter: SERVICE_USER_TYPE.APPELLANT
			})
		).toBe(false);
	});

	it('should return true if published representation exists with the given type regardless of submitter', () => {
		const representations = [
			{
				representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED,
				userOwnsRepresentation: false,
				representationType: 'type1',
				submittingPartyType: SERVICE_USER_TYPE.AGENT
			}
		];
		expect(representationPublished(representations, { type: 'type1' })).toBe(true);
	});

	it('should return false if representations array is undefined', () => {
		expect(
			representationPublished(undefined, { type: 'type1', submitter: SERVICE_USER_TYPE.APPELLANT })
		).toBe(false);
	});
});

describe('getRepresentationSubmissionDate', () => {
	it('should return the representation dateReceived if the specified representation type exists', () => {
		const representations = [
			{
				representationType: 'type1',
				userOwnsRepresentation: true,
				submittingPartyType: SERVICE_USER_TYPE.APPELLANT,
				dateReceived: 'today'
			},
			{
				representationType: 'type1',
				userOwnsRepresentation: false,
				submittingPartyType: LPA_USER_ROLE,
				dateReceived: 'last week'
			},
			{
				representationType: 'type2',
				userOwnsRepresentation: false,
				submittingPartyType: SERVICE_USER_TYPE.APPELLANT,
				dateReceived: 'yesterday'
			}
		];
		expect(
			getRepresentationSubmissionDate(representations, {
				type: 'type1',
				owned: true,
				submitter: SERVICE_USER_TYPE.APPELLANT
			})
		).toBe('today');
	});

	it('should return undefined if no representation exists with the given type and ownership', () => {
		const representations = [
			{ representationType: 'type1', userOwnsRepresentation: false },
			{ representationType: 'type2', userOwnsRepresentation: false }
		];
		expect(getRepresentationSubmissionDate(representations, { type: 'type1', owned: true })).toBe(
			undefined
		);
	});

	it('should return undefined if representation array is undefined', () => {
		expect(getRepresentationSubmissionDate(undefined, { type: 'type1', owned: true })).toBe(
			undefined
		);
	});
});
