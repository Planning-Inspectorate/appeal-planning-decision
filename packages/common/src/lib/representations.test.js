const { representationExists, representationPublished } = require('./representations');
const { APPEAL_REPRESENTATION_STATUS, SERVICE_USER_TYPE } = require('pins-data-model');

describe('representationExists', () => {
	it('should return true if representation exists with the given type and ownership', () => {
		const representations = [
			{ representationType: 'type1', userOwnsRepresentation: true },
			{ representationType: 'type2', userOwnsRepresentation: false }
		];
		expect(representationExists(representations, 'type1', true)).toBe(true);
	});

	it('should return false if no representation exists with the given type and ownership', () => {
		const representations = [
			{ representationType: 'type1', userOwnsRepresentation: false },
			{ representationType: 'type2', userOwnsRepresentation: false }
		];
		expect(representationExists(representations, 'type1', true)).toBe(false);
	});

	it('should return true if representation exists with the given type regardless of ownership', () => {
		const representations = [
			{ representationType: 'type1', userOwnsRepresentation: false },
			{ representationType: 'type2', userOwnsRepresentation: false }
		];
		expect(representationExists(representations, 'type1', false)).toBe(true);
	});

	it('should return false if representations array is undefined', () => {
		expect(representationExists(undefined, 'type1', true)).toBe(false);
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
		expect(representationPublished(representations, 'type1', SERVICE_USER_TYPE.APPELLANT)).toBe(
			true
		);
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
		expect(representationPublished(representations, 'type1', SERVICE_USER_TYPE.APPELLANT)).toBe(
			false
		);
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
		expect(representationPublished(representations, 'type1')).toBe(true);
	});

	it('should return false if representations array is undefined', () => {
		expect(representationPublished(undefined, 'type1', SERVICE_USER_TYPE.APPELLANT)).toBe(false);
	});
});
