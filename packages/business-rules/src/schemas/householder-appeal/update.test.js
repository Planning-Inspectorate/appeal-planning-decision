const { subYears, addYears, subMonths } = require('date-fns');
const v8 = require('v8');
const appealData = require('../../../test/data/householder-appeal');
const update = require('./update');
const { APPEAL_STATE, TYPE_OF_PLANNING_APPLICATION } = require('../../constants');

describe('schemas/householder-appeal/update', () => {
	const config = {};

	let appeal;
	let appeal2;

	beforeEach(() => {
		appeal = v8.deserialize(v8.serialize(appealData));
		appeal2 = v8.deserialize(v8.serialize(appealData));
	});

	describe('update', () => {
		it('should return the data when given valid data', async () => {
			const result = await update.validate(appeal, config);
			expect(result).toEqual(appeal);
		});

		it('should remove unknown fields', async () => {
			appeal2.unknownField = 'unknown field';

			const result = await update.validate(appeal2, config);
			expect(result).toEqual(appeal);
		});

		describe('id', () => {
			it('should throw an error when not given a UUID', async () => {
				appeal.id = 'abc123';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'id must be a valid UUID'
				);
			});

			it('should throw an error when given a null value', async () => {
				appeal.id = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'id must be a `string` type, but the final value was: `null`'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.id;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'id is a required field'
				);
			});
		});

		describe('lpaCode', () => {
			it('should throw an error when given a value with more than 20 characters', async () => {
				appeal.lpaCode = 'a'.repeat(21);

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'lpaCode must be at most 20 characters'
				);
			});

			it('should strip leading/trailing spaces', async () => {
				appeal.lpaCode = '  abc123  ';

				const result = await update.validate(appeal, config);
				expect(result).toEqual({
					...appeal,
					lpaCode: 'abc123'
				});
			});

			it('should throw an error when given a null value', async () => {
				appeal.lpaCode = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'lpaCode must be a `string` type, but the final value was: `null`'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.lpaCode;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'lpaCode is a required field'
				);
			});
		});

		describe('decisionDate', () => {
			it('should throw an error when given a value which is in an incorrect format', async () => {
				appeal.decisionDate = '03/07/2021';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'Invalid Date or string not ISO format'
				);
			});

			it('should throw an error when given a date in the future', async () => {
				appeal.decisionDate = addYears(new Date(), 1);

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'decisionDate must be in the past'
				);
			});

			it('should throw an error when given a date after the deadline date', async () => {
				appeal.decisionDate = subYears(new Date(), 1);

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'decisionDate must be before the deadline date'
				);
			});

			it('should throw an error when given a null value', async () => {
				appeal.decisionDate = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'decisionDate must be a `date` type, but the final value was: `null`'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.decisionDate;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'The given date must be a valid Date instance'
				);
			});

			it('should return a value when appeal type and application decision is not passed', async () => {
				appeal.decisionDate = subMonths(new Date(), 1);
				delete appeal.appealType;
				delete appeal.eligibility.applicationDecision;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});

		describe('createdAt', () => {
			it('should throw an error when given a value which is in an incorrect format', async () => {
				appeal.createdAt = '03/07/2021';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'Invalid Date or string not ISO format'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.createdAt;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'createdAt is a required field'
				);
			});
		});

		describe('updatedAt', () => {
			it('should throw an error when given a value which is in an incorrect format', async () => {
				appeal.updatedAt = '03/07/2021';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'Invalid Date or string not ISO format'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.updatedAt;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'updatedAt is a required field'
				);
			});
		});

		describe('submissionDate', () => {
			it('should throw an error when given a value which is in an incorrect format', async () => {
				appeal.submissionDate = '03/07/2021';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'Invalid Date or string not ISO format'
				);
			});

			it('should not throw an error when not given a value', async () => {
				delete appeal.submissionDate;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});

		describe('state', () => {
			it('should throw an error when given an invalid value', async () => {
				appeal.state = 'PENDING';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					`state must be one of the following values: ${Object.values(APPEAL_STATE).join(', ')}`
				);
			});

			it('should throw an error when given a null value', async () => {
				appeal.state = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'state must be a `string` type, but the final value was: `null`'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.state;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'state is a required field'
				);
			});
		});

		describe('appealType', () => {
			it('should throw an error when given an invalid value', async () => {
				appeal.appealType = '0001';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'0001 is not a valid appeal type'
				);
			});

			it('should not throw an error when not given a value', async () => {
				appeal.appealType = null;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});

			it('should not throw an error when not given a value', async () => {
				delete appeal.appealType;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});

		describe('typeOfPlanningApplication', () => {
			it('should throw an error when given an invalid value', async () => {
				appeal.typeOfPlanningApplication = 'appeal';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					`typeOfPlanningApplication must be one of the following values: ${Object.values(
						TYPE_OF_PLANNING_APPLICATION
					).join(', ')}`
				);
			});

			it('should not throw an error when not given a value', async () => {
				delete appeal.typeOfPlanningApplication;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});

			it('should not throw an error when given a null value', async () => {
				appeal.typeOfPlanningApplication = null;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});

		describe('eligibility', () => {
			it('should remove unknown fields', async () => {
				appeal2.eligibility.unknownField = 'unknown field';

				const result = await update.validate(appeal2, config);
				expect(result).toEqual(appeal);
			});

			it('should throw an error when given a null value', async () => {
				appeal.eligibility = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility must be a `object` type, but the final value was: `null`'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.eligibility;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.isListedBuilding is a required field'
				);
			});
		});

		describe('eligibility.applicationDecision', () => {
			it('should throw an error when given an invalid value', async () => {
				appeal.eligibility.applicationDecision = 'appeal';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					`appeal must be a valid application decision`
				);
			});

			it('should throw an error when given an invalid value', async () => {
				appeal.eligibility.applicationDecision = null;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});

			it('should not throw an error when not given a value', async () => {
				delete appeal.eligibility.applicationDecision;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});

		describe('eligibility.enforcementNotice', () => {
			it('should throw an error when not given a boolean value', async () => {
				appeal.eligibility.enforcementNotice = 'yes';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.enforcementNotice must be a `boolean` type, but the final value was: `"yes"`'
				);
			});

			it('should throw an error when given a null value', async () => {
				appeal.eligibility.enforcementNotice = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.enforcementNotice must be a `boolean` type, but the final value was: `null`'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.eligibility.enforcementNotice;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.enforcementNotice is a required field'
				);
			});
		});

		describe('eligibility.hasPriorApprovalForExistingHome', () => {
			it('should throw an error when not given a boolean value', async () => {
				appeal.eligibility.hasPriorApprovalForExistingHome = 'yes';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.hasPriorApprovalForExistingHome must be a `boolean` type, but the final value was: `"yes"`'
				);
			});

			it('should not throw an error when given a null value', async () => {
				appeal.eligibility.hasPriorApprovalForExistingHome = null;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});

		describe('eligibility.hasHouseholderPermissionConditions', () => {
			it('should throw an error when not given a boolean value', async () => {
				appeal.eligibility = {
					hasHouseholderPermissionConditions: 'yes'
				};

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.hasHouseholderPermissionConditions must be a `boolean` type, but the final value was: `"yes"`'
				);
			});

			it('should not throw an error when given a null value', async () => {
				appeal.eligibility.hasHouseholderPermissionConditions = null;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});

		describe('eligibility.householderPlanningPermission', () => {
			it('should throw an error when not given a boolean value', async () => {
				appeal.eligibility = {
					householderPlanningPermission: 'yes'
				};

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.householderPlanningPermission must be a `boolean` type, but the final value was: `"yes"`'
				);
			});

			it('should not throw an error when not given a value', async () => {
				delete appeal.eligibility.householderPlanningPermission;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});

		describe('eligibility.isClaimingCosts', () => {
			it('should throw an error when not given a boolean value', async () => {
				appeal.eligibility = {
					isClaimingCosts: 'yes'
				};

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.isClaimingCosts must be a `boolean` type, but the final value was: `"yes"`'
				);
			});

			it('should throw an error when given a null value', async () => {
				appeal.eligibility.isClaimingCosts = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.isClaimingCosts must be a `boolean` type, but the final value was: `null`'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.eligibility.isClaimingCosts;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.isClaimingCosts is a required field'
				);
			});
		});

		describe('eligibility.isListedBuilding', () => {
			it('should throw an error when not given a boolean value', async () => {
				appeal.eligibility = {
					isListedBuilding: 'yes'
				};

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.isListedBuilding must be a `boolean` type, but the final value was: `"yes"`'
				);
			});

			it('should throw an error when given a null value', async () => {
				appeal.eligibility.isListedBuilding = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.isListedBuilding must be a `boolean` type, but the final value was: `null`'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.eligibility.isListedBuilding;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.isListedBuilding is a required field'
				);
			});
		});
	});
});
