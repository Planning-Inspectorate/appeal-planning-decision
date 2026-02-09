const v8 = require('v8');
const { addYears, subYears, subMonths } = require('date-fns');
const appealData = require('../../../test/data/full-appeal');
const update = require('./update');
const {
	APPEAL_STATE,
	TYPE_OF_PLANNING_APPLICATION,
	APPLICATION_ABOUT
} = require('../../constants');

describe('schemas/full-appeal/update', () => {
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

		describe('id', () => {
			it('should strip leading/trailing spaces', async () => {
				appeal2.id = '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
				appeal.id = '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

				const result = await update.validate(appeal2, config);
				expect(result).toEqual(appeal);
			});

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

			it('should throw an error when not given a value', async () => {
				delete appeal.appealType;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'appealType is a required field'
				);
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

			it('should throw an error when not given a value', async () => {
				delete appeal.typeOfPlanningApplication;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'typeOfPlanningApplication is a required field'
				);
			});
		});

		describe('planningApplicationAbout', () => {
			it('should throw an error when given an invalid value', async () => {
				appeal.eligibility.planningApplicationAbout = ['nope'];

				await expect(update.validate(appeal, config)).rejects.toThrow(
					'planningApplicationAbout must be one or more of the following values: change_of_use, change_units_in_building, not_wholly_ground_floor, gross_internal_area, none_of_these'
				);
			});

			it('should allow no value', async () => {
				appeal.eligibility.planningApplicationAbout = null;
				const result = await update.validate(appeal, config);
				expect(result).toBe(appeal);
			});

			it('should allow valid value', async () => {
				appeal.eligibility.planningApplicationAbout = [
					APPLICATION_ABOUT.NON_OF_THESE,
					APPLICATION_ABOUT.GROSS_INTERNAL_AREA
				];
				const result = await update.validate(appeal, config);
				expect(result).toBe(appeal);
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

			it('should throw an error when appeal type and application decision is not passed', async () => {
				appeal.decisionDate = subMonths(new Date(), 1);
				delete appeal.appealType;
				delete appeal.eligibility.applicationDecision;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'appealType is a required field'
				);
			});
		});

		describe('eligibility', () => {
			it('should throw an error when given a null value', async () => {
				appeal.eligibility = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility must be a `object` type, but the final value was: `null`'
				);
			});

			describe('eligibility.applicationCategories', () => {
				it('should throw an error when given a string value', async () => {
					appeal.eligibility.applicationCategories = 'none_of_these';

					await expect(() => update.validate(appeal, config)).rejects.toThrow;
				});

				it('should throw an error when given an invalid value', async () => {
					appeal.eligibility.applicationCategories = ['a_listed_building'];

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'applicationCategories must be one or more of the following values: none_of_these'
					);
				});

				it('should throw an error when not given a value', async () => {
					delete appeal.eligibility.applicationCategories;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'applicationCategories must be one or more of the following values: none_of_these'
					);
				});
			});

			describe('eligibility.applicationDecision', () => {
				it('should throw an error when given an invalid value', async () => {
					appeal.eligibility.applicationDecision = 'appeal';

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appeal must be a valid application decision'
					);
				});

				it('should throw an error when not given a value', async () => {
					delete appeal.eligibility.applicationDecision;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'eligibility.applicationDecision is a required field'
					);
				});
			});

			describe('eligibility.enforcementNotice', () => {
				it('should throw an error when not given a boolean value', async () => {
					appeal.eligibility = {
						enforcementNotice: 'yes'
					};

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
					appeal.eligibility = {
						hasPriorApprovalForExistingHome: 'yes'
					};

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'eligibility.hasPriorApprovalForExistingHome must be a `boolean` type, but the final value was: `"yes"`'
					);
				});

				it('should not throw an error when not given a value', async () => {
					delete appeal.eligibility.hasPriorApprovalForExistingHome;

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

				it('should not throw an error when not given a value', async () => {
					delete appeal.eligibility.hasHouseholderPermissionConditions;

					const result = await update.validate(appeal, config);
					expect(result).toEqual(appeal);
				});
			});
		});

		describe('eligibility.applicationDecision', () => {
			it('should throw an error when given an invalid value', async () => {
				appeal.eligibility.applicationDecision = 'appeal';

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'appeal must be a valid application decision'
				);
			});

			it('should throw an error when not given a value', async () => {
				delete appeal.eligibility.applicationDecision;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.applicationDecision is a required field'
				);
			});
		});

		describe('eligibility.enforcementNotice', () => {
			it('should throw an error when not given a boolean value', async () => {
				appeal.eligibility = {
					enforcementNotice: 'yes'
				};

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

		describe('eligibility.isListedBuilding', () => {
			it('should throw an error when not given a boolean value', async () => {
				appeal.eligibility = {
					isListedBuilding: 'yes'
				};

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'eligibility.isListedBuilding must be a `boolean` type, but the final value was: `"yes"`'
				);
			});

			it('should not throw an error when not given a value', async () => {
				delete appeal.isListedBuilding;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
			});
		});
	});
});
