const v8 = require('v8');
const { addYears, subYears, subMonths } = require('date-fns');
const appealData = require('../../../test/data/full-appeal');
const update = require('./update');
const {
	APPEAL_STATE,
	KNOW_THE_OWNERS,
	PROCEDURE_TYPE,
	SECTION_STATE,
	STANDARD_TRIPLE_CONFIRM_OPTIONS,
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

		describe('horizonId', () => {
			it('should throw an error when given a value with more than 20 characters', async () => {
				appeal.horizonId = 'a'.repeat(21);

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'horizonId must be at most 20 characters'
				);
			});

			it('should strip leading/trailing spaces', async () => {
				appeal.horizonId = '  abc123  ';

				const result = await update.validate(appeal, config);
				expect(result).toEqual({
					...appeal,
					horizonId: 'abc123'
				});
			});

			it('should not throw an error when not given a value', async () => {
				delete appeal.horizonId;

				const result = await update.validate(appeal, config);
				expect(result).toEqual(appeal);
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

		describe('appealDocumentsSection', () => {
			it('should throw an error when given a null value', async () => {
				appeal.appealDocumentsSection = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'appealDocumentsSection must be a `object` type, but the final value was: `null`'
				);
			});

			describe('appealDocumentsSection.appealStatement', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealDocumentsSection.appealStatement = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealDocumentsSection.appealStatement must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealDocumentsSection.appealStatement.uploadedFile', () => {
					it('should throw an error when given a null value', async () => {
						appeal.appealDocumentsSection.appealStatement.uploadedFile = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDocumentsSection.appealStatement.uploadedFile must be a `object` type, but the final value was: `null`'
						);
					});

					describe('appealDocumentsSection.appealStatement.uploadedFile.name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDocumentsSection.appealStatement.uploadedFile.name = 'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.appealStatement.uploadedFile.name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.appealStatement.uploadedFile.name = '  test-pdf.pdf  ';
							appeal.appealDocumentsSection.appealStatement.uploadedFile.name = 'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.appealStatement.uploadedFile.name;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.appealStatement.uploadedFile.name is a required field'
							);
						});
					});

					describe('appealDocumentsSection.appealStatement.uploadedFile.originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDocumentsSection.appealStatement.uploadedFile.originalFileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.appealStatement.uploadedFile.originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.appealStatement.uploadedFile.originalFileName =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.appealStatement.uploadedFile.originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.appealStatement.uploadedFile.originalFileName;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.appealStatement.uploadedFile.originalFileName is a required field'
							);
						});
					});

					describe('appealDocumentsSection.appealStatement.uploadedFile.id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.appealStatement.uploadedFile.id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.appealDocumentsSection.appealStatement.uploadedFile.id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.appealDocumentsSection.appealStatement.uploadedFile.id = 'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.appealStatement.uploadedFile.id must be a valid UUID'
							);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.appealStatement.uploadedFile.id;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.appealStatement.uploadedFile.id is a required field'
							);
						});
					});
				});

				describe('appealDocumentsSection.appealStatement.hasSensitiveInformation', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealDocumentsSection.appealStatement.hasSensitiveInformation = 'false ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDocumentsSection.appealStatement.hasSensitiveInformation must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealDocumentsSection.appealStatement.hasSensitiveInformation;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDocumentsSection.appealStatement.hasSensitiveInformation is a required field'
						);
					});
				});
			});

			describe('appealDocumentsSection.plansDrawings', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealDocumentsSection.plansDrawings = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealDocumentsSection.plansDrawings must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealDocumentsSection.plansDrawings.hasPlansDrawings', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = 'true ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDocumentsSection.plansDrawings.hasPlansDrawings must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDocumentsSection.plansDrawings.hasPlansDrawings is a required field'
						);
					});
				});

				describe('appealDocumentsSection.plansDrawings.uploadedFiles', () => {
					it('should not throw an error when not given a value', async () => {
						delete appeal.appealDocumentsSection.plansDrawings.uploadedFiles;
						appeal2.appealDocumentsSection.plansDrawings.uploadedFiles = [];

						const result = await update.validate(appeal2, config);
						expect(result).toEqual(appeal2);
					});

					describe('appealDocumentsSection.plansDrawings.uploadedFiles[0].id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.plansDrawings.uploadedFiles[0].id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].id = 'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.plansDrawings.uploadedFiles[0].id must be a valid UUID'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].id;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.plansDrawings.uploadedFiles[0].name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].name = 'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.plansDrawings.uploadedFiles[0].name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.plansDrawings.uploadedFiles[0].name =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].name = 'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].name;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.plansDrawings.uploadedFiles[0].fileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].fileName = 'a'.repeat(
								256
							);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.plansDrawings.uploadedFiles[0].fileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.plansDrawings.uploadedFiles[0].fileName =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].fileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].fileName;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.plansDrawings.uploadedFiles[0].originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].originalFileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.plansDrawings.uploadedFiles[0].originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.plansDrawings.uploadedFiles[0].originalFileName =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].originalFileName;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.plansDrawings.uploadedFiles[0].location', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.plansDrawings.uploadedFiles[0].location =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].location =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].location;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.plansDrawings.uploadedFiles[0].size', () => {
						it('should throw an error when not given a number', async () => {
							appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].size = 'not-a-number';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.plansDrawings.uploadedFiles[0].size must be a `number` type, but the final value was: `NaN` (cast from the value `1000`).'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.plansDrawings.uploadedFiles[0].size;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});
				});
			});

			describe('appealDocumentsSection.supportingDocuments', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealDocumentsSection.supportingDocuments = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealDocumentsSection.supportingDocuments must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealDocumentsSection.supportingDocuments.hasSupportingDocuments', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealDocumentsSection.supportingDocuments.hasSupportingDocuments = 'true ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDocumentsSection.supportingDocuments.hasSupportingDocuments must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealDocumentsSection.supportingDocuments.hasSupportingDocuments;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDocumentsSection.supportingDocuments.hasSupportingDocuments is a required field'
						);
					});
				});

				describe('appealDocumentsSection.supportingDocuments.uploadedFiles', () => {
					it('should not throw an error when not given a value', async () => {
						delete appeal.appealDocumentsSection.supportingDocuments.uploadedFiles;
						appeal2.appealDocumentsSection.supportingDocuments.uploadedFiles = [];

						const result = await update.validate(appeal2, config);
						expect(result).toEqual(appeal2);
					});

					describe('appealDocumentsSection.supportingDocuments.uploadedFiles[0].id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.supportingDocuments.uploadedFiles[0].id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].id = 'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.supportingDocuments.uploadedFiles[0].id must be a valid UUID'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].id;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.supportingDocuments.uploadedFiles[0].name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].name = 'a'.repeat(
								256
							);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.supportingDocuments.uploadedFiles[0].name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.supportingDocuments.uploadedFiles[0].name =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].name =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].name;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.supportingDocuments.uploadedFiles[0].fileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].fileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.supportingDocuments.uploadedFiles[0].fileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.supportingDocuments.uploadedFiles[0].fileName =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].fileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].fileName;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.supportingDocuments.uploadedFiles[0].originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].originalFileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.supportingDocuments.uploadedFiles[0].originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.supportingDocuments.uploadedFiles[0].originalFileName =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0]
								.originalFileName;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.supportingDocuments.uploadedFiles[0].location', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDocumentsSection.supportingDocuments.uploadedFiles[0].location =
								'  test-pdf.pdf  ';
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].location =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].location;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('appealDocumentsSection.supportingDocuments.uploadedFiles[0].size', () => {
						it('should throw an error when not given a number', async () => {
							appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].size =
								'not-a-number';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealDocumentsSection.supportingDocuments.uploadedFiles[0].size must be a `number` type, but the final value was: `NaN` (cast from the value `1000`).'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDocumentsSection.supportingDocuments.uploadedFiles[0].size;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});
				});
			});
		});

		describe('contactDetailsSection', () => {
			it('should throw an error when given a null value', async () => {
				appeal.contactDetailsSection = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'contactDetailsSection must be a `object` type, but the final value was: `null`'
				);
			});

			describe('contactDetailsSection.isOriginalApplicant', () => {
				it('should throw an error when not given a boolean value', async () => {
					appeal.contactDetailsSection = {
						isOriginalApplicant: 'yes'
					};

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'contactDetailsSection.isOriginalApplicant must be a `boolean` type, but the final value was: `"yes"`'
					);
				});

				it('should throw an error when given a null value', async () => {
					appeal.contactDetailsSection.isOriginalApplicant = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'contactDetailsSection.isOriginalApplicant must be a `boolean` type, but the final value was: `null`'
					);
				});

				it('should throw an error when not given a value', async () => {
					delete appeal.contactDetailsSection.isOriginalApplicant;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'contactDetailsSection.isOriginalApplicant is a required field'
					);
				});
			});

			describe('contactDetailsSection.contact', () => {
				it('should throw an error when given a null value', async () => {
					appeal.contactDetailsSection.contact = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'contactDetailsSection.contact must be a `object` type, but the final value was: `null`'
					);
				});

				describe('contactDetailsSection.contact.name', () => {
					it('should throw an error when not given a string value', async () => {
						appeal.contactDetailsSection.contact.name = 123;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`contactDetailsSection.contact.name must match the following: "/^[a-z\\-' ]+$/i"`
						);
					});

					it('should throw an error when given a value with less than 2 characters', async () => {
						appeal.contactDetailsSection.contact.name = 'a';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'contactDetailsSection.contact.name must be at least 2 characters'
						);
					});

					it('should throw an error when given a value with more than 80 characters', async () => {
						appeal.contactDetailsSection.contact.name = 'a'.repeat(81);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'contactDetailsSection.contact.name must be at most 80 characters'
						);
					});

					it('should throw an error when given a value with invalid characters', async () => {
						appeal.contactDetailsSection.contact.name = '!?<>';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`contactDetailsSection.contact.name must match the following: "/^[a-z\\-' ]+$/i"`
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.contactDetailsSection.contact.name;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'contactDetailsSection.contact.name is a required field'
						);
					});
				});

				describe('contactDetailsSection.contact.email', () => {
					it('should throw an error when not given an email value', async () => {
						appeal.email = 'apellant@example';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'email must be a valid email'
						);
					});

					it('should throw an error when given a value with more than 255 characters', async () => {
						appeal.email = `${'a'.repeat(244)}@example.com`;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'email must be at most 255 characters'
						);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.email;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'email is a required field'
						);
					});
				});

				describe('contactDetailsSection.contact.companyName', () => {
					it('should throw an error when given a value with more than 50 characters', async () => {
						appeal.contactDetailsSection.contact.companyName = 'a'.repeat(51);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'contactDetailsSection.contact.companyName must be at most 50 characters'
						);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.contactDetailsSection.contact.companyName;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});
			});

			describe('contactDetailsSection.appealingOnBehalfOf', () => {
				it('should throw an error when given a null value', async () => {
					appeal.contactDetailsSection.appealingOnBehalfOf = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'contactDetailsSection.appealingOnBehalfOf must be a `object` type, but the final value was: `null`'
					);
				});

				describe('contactDetailsSection.appealingOnBehalfOf.name', () => {
					it('should throw an error when not given a string value', async () => {
						appeal.contactDetailsSection.appealingOnBehalfOf.name = 123;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`contactDetailsSection.appealingOnBehalfOf.name must match the following: "/^[a-z\\-' ]*$/i"`
						);
					});

					it('should throw an error when given a value with more than 80 characters', async () => {
						appeal.contactDetailsSection.appealingOnBehalfOf.name = 'a'.repeat(81);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'contactDetailsSection.appealingOnBehalfOf.name must be at most 80 characters'
						);
					});

					it('should throw an error when given a value with invalid characters', async () => {
						appeal.contactDetailsSection.appealingOnBehalfOf.name = '!?<>';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`contactDetailsSection.appealingOnBehalfOf.name must match the following: "/^[a-z\\-' ]*$/i"`
						);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.contactDetailsSection.appealingOnBehalfOf.name;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('contactDetailsSection.appealingOnBehalfOf.companyName', () => {
					it('should not throw an error when not given a value', async () => {
						delete appeal.contactDetailsSection.appealingOnBehalfOf.companyName;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});
			});
		});

		describe('appealSiteSection', () => {
			it('should throw an error when given a null value', async () => {
				appeal.appealSiteSection = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'appealSiteSection must be a `object` type, but the final value was: `null`'
				);
			});

			describe('appealSiteSection.siteAddress', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealSiteSection.siteAddress = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealSiteSection.siteAddress must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealSiteSection.siteAddress.addressLine1', () => {
					it('should throw an error when given a value with more than 60 characters', async () => {
						appeal.appealSiteSection.siteAddress.addressLine1 = 'a'.repeat(61);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.addressLine1 must be at most 60 characters'
						);
					});

					it('should throw an error when given a null value', async () => {
						appeal.appealSiteSection.siteAddress.addressLine1 = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.addressLine1 must be a `string` type, but the final value was: `null`'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteAddress.addressLine1;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.addressLine1 is a required field'
						);
					});
				});

				describe('appealSiteSection.siteAddress.addressLine2', () => {
					it('should throw an error when given a value with more than 60 characters', async () => {
						appeal.appealSiteSection.siteAddress.addressLine2 = 'a'.repeat(61);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.addressLine2 must be at most 60 characters'
						);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteAddress.addressLine2;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('appealSiteSection.siteAddress.town', () => {
					it('should throw an error when given a value with more than 60 characters', async () => {
						appeal.appealSiteSection.siteAddress.town = 'a'.repeat(61);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.town must be at most 60 characters'
						);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteAddress.town;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('appealSiteSection.siteAddress.county', () => {
					it('should throw an error when given a value with more than 60 characters', async () => {
						appeal.appealSiteSection.siteAddress.county = 'a'.repeat(61);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.county must be at most 60 characters'
						);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteAddress.county;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('appealSiteSection.siteAddress.postcode', () => {
					it('should throw an error when given a value with more than 8 characters', async () => {
						appeal.appealSiteSection.siteAddress.postcode = 'a'.repeat(9);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.postcode must be at most 8 characters'
						);
					});

					it('should throw an error when given a null value', async () => {
						appeal.appealSiteSection.siteAddress.postcode = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.postcode must be a `string` type, but the final value was: `null`'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteAddress.postcode;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteAddress.postcode is a required field'
						);
					});
				});
			});

			describe('appealSiteSection.siteOwnership', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealSiteSection.siteOwnership = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealSiteSection.siteOwnership must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealSiteSection.siteOwnership.ownsSomeOfTheLand', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand = 'false ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteOwnership.ownsSomeOfTheLand must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).'
						);
					});

					it('should not throw an error when given a null value', async () => {
						appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand = null;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('appealSiteSection.siteOwnership.ownsAllTheLand', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealSiteSection.siteOwnership.ownsAllTheLand = 'true ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteOwnership.ownsAllTheLand must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteOwnership.ownsAllTheLand;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteOwnership.ownsAllTheLand is a required field'
						);
					});
				});

				describe('appealSiteSection.siteOwnership.knowsTheOwners', () => {
					it('should throw an error when given an invalid value', async () => {
						appeal.appealSiteSection.siteOwnership.knowsTheOwners = 'perhaps';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`appealSiteSection.siteOwnership.knowsTheOwners must be one of the following values: ${Object.values(
								KNOW_THE_OWNERS
							).join(', ')}`
						);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteOwnership.knowsTheOwners;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});

					it('should not throw an error when given a null value', async () => {
						appeal.appealSiteSection.siteOwnership.knowsTheOwners = null;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('appealSiteSection.siteOwnership.hasIdentifiedTheOwners', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealSiteSection.siteOwnership.hasIdentifiedTheOwners = 'false ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.siteOwnership.hasIdentifiedTheOwners must be a `boolean` type, but the final value was: `"false "` (cast from the value `true`).'
						);
					});

					it('should not throw an error when given a null value', async () => {
						appeal.appealSiteSection.siteOwnership.hasIdentifiedTheOwners = null;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.siteOwnership.hasIdentifiedTheOwners;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});
			});

			describe('appealSiteSection.siteOwnership.tellingTheLandowners', () => {
				it('should throw an error if not all tellingTheLandowners options selected', async () => {
					appeal.appealSiteSection.siteOwnership.tellingTheLandowners = [
						STANDARD_TRIPLE_CONFIRM_OPTIONS[0],
						STANDARD_TRIPLE_CONFIRM_OPTIONS[2]
					];

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						`You must have ["toldAboutMyAppeal","withinLast21Days","useCopyOfTheForm"] for appealSiteSection.siteOwnership.tellingTheLandowners but you have ["toldAboutMyAppeal","useCopyOfTheForm"]`
					);
				});

				it('should not throw an error if tellingTheLandowners is undefined', async () => {
					delete appeal.appealSiteSection.siteOwnership.tellingTheLandowners;

					const result = await update.validate(appeal, config);
					expect(result).toEqual(appeal);
				});

				it('should not throw an error if all tellingTheLandowners options selected', async () => {
					appeal.appealSiteSection.siteOwnership.tellingTheLandowners = [
						STANDARD_TRIPLE_CONFIRM_OPTIONS[1],
						STANDARD_TRIPLE_CONFIRM_OPTIONS[0],
						STANDARD_TRIPLE_CONFIRM_OPTIONS[2]
					];

					const result = await update.validate(appeal, config);
					expect(result).toEqual(appeal);
				});
			});

			describe('appealSiteSection.siteOwnership.advertisingYourAppeal', () => {
				it('should throw an error if not all advertisingYourAppeal options selected', async () => {
					appeal.appealSiteSection.siteOwnership.advertisingYourAppeal = [
						STANDARD_TRIPLE_CONFIRM_OPTIONS[0],
						STANDARD_TRIPLE_CONFIRM_OPTIONS[2]
					];

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						`You must have ["toldAboutMyAppeal","withinLast21Days","useCopyOfTheForm"] for appealSiteSection.siteOwnership.advertisingYourAppeal but you have ["toldAboutMyAppeal","useCopyOfTheForm"]`
					);
				});

				it('should not throw an error if advertisingYourAppeal is undefined', async () => {
					delete appeal.appealSiteSection.siteOwnership.advertisingYourAppeal;

					const result = await update.validate(appeal, config);
					expect(result).toEqual(appeal);
				});

				it('should not throw an error if all advertisingYourAppeal options selected', async () => {
					appeal.appealSiteSection.siteOwnership.advertisingYourAppeal = [
						STANDARD_TRIPLE_CONFIRM_OPTIONS[1],
						STANDARD_TRIPLE_CONFIRM_OPTIONS[0],
						STANDARD_TRIPLE_CONFIRM_OPTIONS[2]
					];

					const result = await update.validate(appeal, config);
					expect(result).toEqual(appeal);
				});
			});

			describe('appealSiteSection.agriculturalHolding', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealSiteSection.agriculturalHolding = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealSiteSection.agriculturalHolding must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealSiteSection.agriculturalHolding.isAgriculturalHolding', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealSiteSection.agriculturalHolding.isAgriculturalHolding = 'true ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.agriculturalHolding.isAgriculturalHolding must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.agriculturalHolding.isAgriculturalHolding;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.agriculturalHolding.isAgriculturalHolding is a required field'
						);
					});
				});

				describe('appealSiteSection.agriculturalHolding.isTenant', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealSiteSection.agriculturalHolding.isTenant = 'true ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.agriculturalHolding.isTenant must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).'
						);
					});

					it('should not throw an error when given a null value', async () => {
						appeal.appealSiteSection.agriculturalHolding.isTenant = null;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.agriculturalHolding.isTenant;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('appealSiteSection.agriculturalHolding.hasOtherTenants', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealSiteSection.agriculturalHolding.hasOtherTenants = 'true ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.agriculturalHolding.hasOtherTenants must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).'
						);
					});

					it('should not throw an error when given a null value', async () => {
						appeal.appealSiteSection.agriculturalHolding.hasOtherTenants = null;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.agriculturalHolding.hasOtherTenants;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('appealSiteSection.agriculturalHolding.tellingTheTenants', () => {
					it('should throw an error if not all tellingTheTenants options selected', async () => {
						appeal.appealSiteSection.agriculturalHolding.tellingTheTenants = [
							STANDARD_TRIPLE_CONFIRM_OPTIONS[0],
							STANDARD_TRIPLE_CONFIRM_OPTIONS[2]
						];

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`You must have ["toldAboutMyAppeal","withinLast21Days","useCopyOfTheForm"] for appealSiteSection.agriculturalHolding.tellingTheTenants but you have ["toldAboutMyAppeal","useCopyOfTheForm"]`
						);
					});

					it('should not throw an error if tellingTheTenants is undefined', async () => {
						delete appeal.appealSiteSection.agriculturalHolding.tellingTheTenants;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});

					it('should not throw an error if all tellingTheTenants options selected', async () => {
						appeal.appealSiteSection.agriculturalHolding.tellingTheTenants = [
							STANDARD_TRIPLE_CONFIRM_OPTIONS[1],
							STANDARD_TRIPLE_CONFIRM_OPTIONS[0],
							STANDARD_TRIPLE_CONFIRM_OPTIONS[2]
						];

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});
			});

			describe('appealSiteSection.visibleFromRoad', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealSiteSection.visibleFromRoad = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealSiteSection.visibleFromRoad must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealSiteSection.visibleFromRoad.isVisible', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealSiteSection.visibleFromRoad.isVisible = 'false ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.visibleFromRoad.isVisible must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.visibleFromRoad.isVisible;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.visibleFromRoad.isVisible is a required field'
						);
					});
				});

				describe('appealSiteSection.visibleFromRoad.details', () => {
					it('should throw an error when not given a value and appealSiteSection.visibleFromRoad.isVisible is false', async () => {
						appeal.appealSiteSection.visibleFromRoad.isVisible = false;
						appeal.appealSiteSection.visibleFromRoad.details = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'Tell us how visibility is restricted'
						);
					});

					it('should throw an error when given a value longer than 1000 chars and appealSiteSection.visibleFromRoad.isVisible is false', async () => {
						appeal.appealSiteSection.visibleFromRoad.isVisible = false;
						appeal.appealSiteSection.visibleFromRoad.details = 'a'.repeat(1001);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'How visibility is restricted must be 1000 characters or less'
						);
					});

					it('should not throw an error when given a null value and appealSiteSection.visibleFromRoad.isVisible is true', async () => {
						appeal.appealSiteSection.visibleFromRoad.isVisible = true;
						appeal.appealSiteSection.visibleFromRoad.details = null;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});
			});

			describe('appealSiteSection.healthAndSafety', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealSiteSection.healthAndSafety = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealSiteSection.healthAndSafety must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealSiteSection.healthAndSafety.hasIssues', () => {
					it('should throw an error when not given a boolean', async () => {
						appeal.appealSiteSection.healthAndSafety.hasIssues = 'true ';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.healthAndSafety.hasIssues must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.appealSiteSection.healthAndSafety.hasIssues;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSiteSection.healthAndSafety.hasIssues is a required field'
						);
					});
				});

				describe('appealSiteSection.healthAndSafety.details', () => {
					it('should throw an error when not given a value and appealSiteSection.healthAndSafety.hasIssues is true', async () => {
						appeal.appealSiteSection.healthAndSafety.hasIssues = true;
						appeal.appealSiteSection.healthAndSafety.details = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'Tell us about the health and safety issues'
						);
					});

					it('should throw an error when given a value longer than 1000 chars and appealSiteSection.healthAndSafety.hasIssues is true', async () => {
						appeal.appealSiteSection.healthAndSafety.hasIssues = true;
						appeal.appealSiteSection.healthAndSafety.details = 'a'.repeat(1001);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'Health and safety information must be 1000 characters or less'
						);
					});

					it('should not throw an error when given a null value and appealSiteSection.healthAndSafety.hasIssues is false', async () => {
						appeal.appealSiteSection.healthAndSafety.hasIssues = false;
						appeal.appealSiteSection.healthAndSafety.details = null;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});
			});
		});

		describe('appealDecisionSection', () => {
			it('should throw an error when given a null value', async () => {
				appeal.appealDecisionSection = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'appealDecisionSection must be a `object` type, but the final value was: `null`'
				);
			});

			describe('appealDecisionSection.procedureType', () => {
				it('should throw an error when given an invalid value', async () => {
					appeal.appealDecisionSection.procedureType = 'Full Appeal';

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						`appealDecisionSection.procedureType must be one of the following values: ${Object.values(
							PROCEDURE_TYPE
						).join(', ')}`
					);
				});

				it('should throw an error when not given a value', async () => {
					delete appeal.appealDecisionSection.procedureType;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealDecisionSection.procedureType is a required field'
					);
				});
			});

			describe('appealDecisionSection.hearing', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealDecisionSection.hearing = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealDecisionSection.hearing must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealDecisionSection.hearing.reason', () => {
					it('should throw an error when given a value with more than 1000 characters', async () => {
						appeal.appealDecisionSection.hearing.reason = 'a'.repeat(1001);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDecisionSection.hearing.reason must be at most 1000 characters'
						);
					});

					it('should strip leading/trailing spaces', async () => {
						appeal2.appealDecisionSection.hearing.reason = '  Reason for having a hearing  ';
						appeal.appealDecisionSection.hearing.reason = 'Reason for having a hearing';

						const result = await update.validate(appeal2, config);
						expect(result).toEqual(appeal);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealDecisionSection.hearing.reason;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});
			});

			describe('appealDecisionSection.inquiry', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealDecisionSection.inquiry = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealDecisionSection.inquiry must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealDecisionSection.inquiry.reason', () => {
					it('should throw an error when given a value with more than 1000 characters', async () => {
						appeal.appealDecisionSection.inquiry.reason = 'a'.repeat(1001);

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDecisionSection.inquiry.reason must be at most 1000 characters'
						);
					});

					it('should strip leading/trailing spaces', async () => {
						appeal2.appealDecisionSection.inquiry.reason = '  Reason for having an inquiry  ';
						appeal.appealDecisionSection.inquiry.reason = 'Reason for having an inquiry';

						const result = await update.validate(appeal2, config);
						expect(result).toEqual(appeal);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealDecisionSection.inquiry.reason;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});

				describe('appealDecisionSection.inquiry.expectedDays', () => {
					it('should throw an error when not given a number', async () => {
						appeal.appealDecisionSection.inquiry.expectedDays = '2!';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDecisionSection.inquiry.expectedDays must be a `number` type, but the final value was: `NaN` (cast from the value `2`).'
						);
					});

					it('should throw an error when not given an integer', async () => {
						appeal.appealDecisionSection.inquiry.expectedDays = 1.5;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDecisionSection.inquiry.expectedDays must be an integer'
						);
					});

					it('should not throw an error when given a value less than 1', async () => {
						appeal.appealDecisionSection.inquiry.expectedDays = 0;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDecisionSection.inquiry.expectedDays must be greater than or equal to 1'
						);
					});

					it('should not throw an error when given a value more than 999', async () => {
						appeal.appealDecisionSection.inquiry.expectedDays = 1000;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDecisionSection.inquiry.expectedDays must be less than or equal to 999'
						);
					});

					it('should not throw an error when not given a value', async () => {
						delete appeal.appealDecisionSection.inquiry.expectedDays;

						const result = await update.validate(appeal, config);
						expect(result).toEqual(appeal);
					});
				});
			});

			describe('appealDecisionSection.draftStatementOfCommonGround', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealDecisionSection.draftStatementOfCommonGround = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealDecisionSection.draftStatementOfCommonGround must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealDecisionSection.draftStatementOfCommonGround.uploadedFile', () => {
					it('should throw an error when given a null value', async () => {
						appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealDecisionSection.draftStatementOfCommonGround.uploadedFile must be a `object` type, but the final value was: `null`'
						);
					});

					describe('draftStatementOfCommonGround.uploadedFile.id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.id = 'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'draftStatementOfCommonGround.uploadedFile.id must be a valid UUID'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal2.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.id;
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.id = null;

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('draftStatementOfCommonGround.uploadedFile.name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.name =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'draftStatementOfCommonGround.uploadedFile.name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.name =
								'  test-pdf.pdf  ';
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.name =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.name = '';

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('draftStatementOfCommonGround.uploadedFile.fileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.fileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'draftStatementOfCommonGround.uploadedFile.fileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.fileName =
								'  test-pdf.pdf  ';
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.fileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.fileName = '';

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('draftStatementOfCommonGround.uploadedFile.originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.originalFileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'draftStatementOfCommonGround.uploadedFile.originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.originalFileName =
								'  test-pdf.pdf  ';
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.originalFileName =
								'';

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('draftStatementOfCommonGround.uploadedFile.location', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.location =
								'  test-pdf.pdf  ';
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.location =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.location = '';

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('draftStatementOfCommonGround.uploadedFile.size', () => {
						it('should throw an error when not given a number', async () => {
							appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.size =
								'not-a-number';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'draftStatementOfCommonGround.uploadedFile.size must be a `number` type, but the final value was: `NaN` (cast from the value `1000`).'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile.size;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});
				});
			});
		});

		describe('planningApplicationDocumentsSection', () => {
			it('should throw an error when given a null value', async () => {
				appeal.planningApplicationDocumentsSection = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'planningApplicationDocumentsSection must be a `object` type, but the final value was: `null`'
				);
			});

			describe('planningApplicationDocumentsSection.plansDrawingsSupportingDocuments', () => {
				it('should throw an error when given a null value', async () => {
					appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments must be a `object` type, but the final value was: `null`'
					);
				});

				describe('planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles', () => {
					it('should not throw an error when not given a value', async () => {
						delete appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
							.uploadedFiles;
						appeal2.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles =
							[];

						const result = await update.validate(appeal2, config);
						expect(result).toEqual(appeal2);
					});

					describe('planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].id =
								'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].id must be a valid UUID'
							);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
								.uploadedFiles[0].id;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].id is a required field'
							);
						});
					});

					describe('planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].name =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].name =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].name =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
								.uploadedFiles[0].name;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].name is a required field'
							);
						});
					});

					describe('planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].fileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].fileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].fileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].fileName =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].fileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
								.uploadedFiles[0].fileName;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].fileName is a required field'
							);
						});
					});

					describe('planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].originalFileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].originalFileName =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
								.uploadedFiles[0].originalFileName;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].originalFileName is a required field'
							);
						});
					});

					describe('planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].location', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].location =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].location =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
								.uploadedFiles[0].location;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].location is a required field'
							);
						});
					});

					describe('planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].size', () => {
						it('should throw an error when not given a number', async () => {
							appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].size =
								'not-a-number';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].size must be a `number` type, but the final value was: `NaN` (cast from the value `1000`).'
							);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.plansDrawingsSupportingDocuments
								.uploadedFiles[0].size;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.plansDrawingsSupportingDocuments.uploadedFiles[0].size is a required field'
							);
						});
					});
				});
			});

			describe('planningApplicationDocumentsSection.originalApplication', () => {
				it('should throw an error when given a null value', async () => {
					appeal.planningApplicationDocumentsSection.originalApplication = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'planningApplicationDocumentsSection.originalApplication must be a `object` type, but the final value was: `null`'
					);
				});

				describe('planningApplicationDocumentsSection.originalApplication.uploadedFile', () => {
					it('should throw an error when given a null value', async () => {
						appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'planningApplicationDocumentsSection.originalApplication.uploadedFile must be a `object` type, but the final value was: `null`'
						);
					});

					describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.originalApplication.uploadedFile.name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile
								.name;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.originalApplication.uploadedFile.name is a required field'
							);
						});
					});

					describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile
								.originalFileName;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName is a required field'
							);
						});
					});

					describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
								'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.originalApplication.uploadedFile.id must be a valid UUID'
							);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.originalApplication.uploadedFile.id is a required field'
							);
						});
					});
				});
			});

			describe('planningApplicationDocumentsSection.decisionLetter', () => {
				it('should throw an error when given a null value', async () => {
					appeal.planningApplicationDocumentsSection.decisionLetter = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'planningApplicationDocumentsSection.decisionLetter must be a `object` type, but the final value was: `null`'
					);
				});

				describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile', () => {
					it('should throw an error when given a null value', async () => {
						appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'planningApplicationDocumentsSection.decisionLetter.uploadedFile must be a `object` type, but the final value was: `null`'
						);
					});

					describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id = 'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.decisionLetter.uploadedFile.id must be a valid UUID'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.decisionLetter.uploadedFile.name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.fileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.fileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.decisionLetter.uploadedFile.fileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.fileName =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.fileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile
								.fileName;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile
								.originalFileName;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.location', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.location =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.location =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile
								.location;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.size', () => {
						it('should throw an error when not given a number', async () => {
							appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.size =
								'not-a-number';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.decisionLetter.uploadedFile.size must be a `number` type, but the final value was: `NaN` (cast from the value `1000`).'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.size;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});
				});
			});

			describe('planningApplicationDocumentsSection.designAccessStatement', () => {
				it('should throw an error when given a null value', async () => {
					appeal.planningApplicationDocumentsSection.designAccessStatement = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'planningApplicationDocumentsSection.designAccessStatement must be a `object` type, but the final value was: `null`'
					);
				});

				describe('planningApplicationDocumentsSection.designAccessStatement.isSubmitted', () => {
					it('should throw an error when not given a boolean value', async () => {
						appeal.planningApplicationDocumentsSection.designAccessStatement = {
							isSubmitted: 'yes'
						};

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'planningApplicationDocumentsSection.designAccessStatement.isSubmitted must be a `boolean` type, but the final value was: `"yes"`'
						);
					});

					it('should throw an error when given a null value', async () => {
						appeal.planningApplicationDocumentsSection.designAccessStatement.isSubmitted = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'planningApplicationDocumentsSection.designAccessStatement.isSubmitted must be a `boolean` type, but the final value was: `null`'
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.planningApplicationDocumentsSection.designAccessStatement.isSubmitted;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'planningApplicationDocumentsSection.designAccessStatement.isSubmitted is a required field'
						);
					});
				});

				describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile', () => {
					it('should throw an error when given a null value', async () => {
						appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'planningApplicationDocumentsSection.designAccessStatement.uploadedFile must be a `object` type, but the final value was: `null`'
						);
					});

					describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
								'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id must be a valid UUID'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
								.id;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
								.name;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.fileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.fileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.fileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.fileName =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.fileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
								.fileName;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
								'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
								.originalFileName;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.location', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.location =
								'  test-pdf.pdf  ';
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.location =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
								.location;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});

					describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.size', () => {
						it('should throw an error when not given a number', async () => {
							appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.size =
								'not-a-number';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.size must be a `number` type, but the final value was: `NaN` (cast from the value `1000`).'
							);
						});

						it('should not throw an error when not given a value', async () => {
							delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
								.size;

							const result = await update.validate(appeal, config);
							expect(result).toEqual(appeal);
						});
					});
				});
			});
		});

		describe('appealSubmission', () => {
			it('should throw an error when given a null value', async () => {
				appeal.appealSubmission = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'appealSubmission must be a `object` type, but the final value was: `null`'
				);
			});

			describe('appealSubmission.appealPDFStatement', () => {
				it('should throw an error when given a null value', async () => {
					appeal.appealSubmission.appealPDFStatement = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'appealSubmission.appealPDFStatement must be a `object` type, but the final value was: `null`'
					);
				});

				describe('appealSubmission.appealPDFStatement.uploadedFile', () => {
					it('should throw an error when given a null value', async () => {
						appeal.appealSubmission.appealPDFStatement.uploadedFile = null;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'appealSubmission.appealPDFStatement.uploadedFile must be a `object` type, but the final value was: `null`'
						);
					});

					describe('appealSubmission.appealPDFStatement.uploadedFile.name', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealSubmission.appealPDFStatement.uploadedFile.name = 'a'.repeat(256);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealSubmission.appealPDFStatement.uploadedFile.name must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealSubmission.appealPDFStatement.uploadedFile.name = '  test-pdf.pdf  ';
							appeal.appealSubmission.appealPDFStatement.uploadedFile.name = 'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.appealSubmission.appealPDFStatement.uploadedFile.name;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealSubmission.appealPDFStatement.uploadedFile.name is a required field'
							);
						});
					});

					describe('appealSubmission.appealPDFStatement.uploadedFile.originalFileName', () => {
						it('should throw an error when given a value with more than 255 characters', async () => {
							appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName = 'a'.repeat(
								256
							);

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealSubmission.appealPDFStatement.uploadedFile.originalFileName must be at most 255 characters'
							);
						});

						it('should strip leading/trailing spaces', async () => {
							appeal2.appealSubmission.appealPDFStatement.uploadedFile.originalFileName =
								'  test-pdf.pdf  ';
							appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName =
								'test-pdf.pdf';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealSubmission.appealPDFStatement.uploadedFile.originalFileName is a required field'
							);
						});
					});

					describe('appealSubmission.appealPDFStatement.uploadedFile.id', () => {
						it('should strip leading/trailing spaces', async () => {
							appeal2.appealSubmission.appealPDFStatement.uploadedFile.id =
								'  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
							appeal.appealSubmission.appealPDFStatement.uploadedFile.id =
								'271c9b5b-af90-4b45-b0e7-0a7882da1e03';

							const result = await update.validate(appeal2, config);
							expect(result).toEqual(appeal);
						});

						it('should throw an error when not given a UUID', async () => {
							appeal.appealSubmission.appealPDFStatement.uploadedFile.id = 'abc123';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealSubmission.appealPDFStatement.uploadedFile.id must be a valid UUID'
							);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.appealSubmission.appealPDFStatement.uploadedFile.id;

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								'appealSubmission.appealPDFStatement.uploadedFile.id is a required field'
							);
						});
					});
				});
			});
		});

		describe('sectionStates', () => {
			it('should throw an error when given a null value', async () => {
				appeal.sectionStates = null;

				await expect(() => update.validate(appeal, config)).rejects.toThrow(
					'sectionStates must be a `object` type, but the final value was: `null`'
				);
			});

			describe('sectionStates.contactDetailsSection', () => {
				it('should throw an error when given a null value', async () => {
					appeal.sectionStates.contactDetailsSection = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'sectionStates.contactDetailsSection must be a `object` type, but the final value was: `null`'
					);
				});

				describe('sectionStates.contactDetailsSection.isOriginalApplicant', () => {
					it('should throw an error when given an invalid value', async () => {
						appeal.sectionStates.contactDetailsSection.isOriginalApplicant = 'NOT COMPLETE';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`sectionStates.contactDetailsSection.isOriginalApplicant must be one of the following values: ${Object.values(
								SECTION_STATE
							).join(', ')}`
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.sectionStates.contactDetailsSection.isOriginalApplicant;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'sectionStates.contactDetailsSection.isOriginalApplicant is a required field'
						);
					});
				});

				describe('sectionStates.contactDetailsSection.contact', () => {
					it('should throw an error when given an invalid value', async () => {
						appeal.sectionStates.contactDetailsSection.contact = 'NOT COMPLETE';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`sectionStates.contactDetailsSection.contact must be one of the following values: ${Object.values(
								SECTION_STATE
							).join(', ')}`
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.sectionStates.contactDetailsSection.contact;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'sectionStates.contactDetailsSection.contact is a required field'
						);
					});
				});

				describe('sectionStates.contactDetailsSection.appealingOnBehalfOf', () => {
					it('should throw an error when given an invalid value', async () => {
						appeal.sectionStates.contactDetailsSection.appealingOnBehalfOf = 'NOT COMPLETE';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`sectionStates.contactDetailsSection.appealingOnBehalfOf must be one of the following values: ${Object.values(
								SECTION_STATE
							).join(', ')}`
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.sectionStates.contactDetailsSection.appealingOnBehalfOf;

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							'sectionStates.contactDetailsSection.appealingOnBehalfOf is a required field'
						);
					});
				});
			});

			describe('sectionStates.appealSiteSection', () => {
				it('should throw an error when given a null value', async () => {
					appeal.sectionStates.appealSiteSection = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'sectionStates.appealSiteSection must be a `object` type, but the final value was: `null`'
					);
				});

				[
					'siteAddress',
					'ownsAllTheLand',
					'agriculturalHolding',
					'areYouATenant',
					'tellingTheTenants',
					'otherTenants',
					'visibleFromRoad',
					'healthAndSafety',
					'someOfTheLand',
					'knowTheOwners',
					'identifyingTheLandOwners',
					'advertisingYourAppeal',
					'tellingTheLandowners'
				].forEach((page) => {
					describe(`sectionStates.appealSiteSection.${page}`, () => {
						it('should throw an error when given an invalid value', async () => {
							appeal.sectionStates.appealSiteSection[page] = 'NOT COMPLETE';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								`sectionStates.appealSiteSection.${page} must be one of the following values: ${Object.values(
									SECTION_STATE
								).join(', ')}`
							);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.sectionStates.appealSiteSection[page];

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								`sectionStates.appealSiteSection.${page} is a required field`
							);
						});
					});
				});
			});

			describe('sectionStates.appealDecisionSection', () => {
				it('should throw an error when given a null value', async () => {
					appeal.sectionStates.appealDecisionSection = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'sectionStates.appealDecisionSection must be a `object` type, but the final value was: `null`'
					);
				});

				[
					'procedureType',
					'hearing',
					'inquiry',
					'inquiryExpectedDays',
					'draftStatementOfCommonGround'
				].forEach((page) => {
					describe(`sectionStates.appealDecisionSection.${page}`, () => {
						it('should throw an error when given an invalid value', async () => {
							appeal.sectionStates.appealDecisionSection[page] = 'NOT COMPLETE';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								`sectionStates.appealDecisionSection.${page} must be one of the following values: ${Object.values(
									SECTION_STATE
								).join(', ')}`
							);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.sectionStates.appealDecisionSection[page];

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								`sectionStates.appealDecisionSection.${page} is a required field`
							);
						});
					});
				});
			});

			describe('sectionStates.planningApplicationDocumentsSection', () => {
				it('should throw an error when given a null value', async () => {
					appeal.sectionStates.planningApplicationDocumentsSection = null;

					await expect(() => update.validate(appeal, config)).rejects.toThrow(
						'sectionStates.planningApplicationDocumentsSection must be a `object` type, but the final value was: `null`'
					);
				});

				[
					'originalApplication',
					'plansDrawingsSupportingDocuments',
					'designAccessStatementSubmitted',
					'decisionLetter',
					'designAccessStatement'
				].forEach((page) => {
					describe(`sectionStates.planningApplicationDocumentsSection.${page}`, () => {
						it('should throw an error when given an invalid value', async () => {
							appeal.sectionStates.planningApplicationDocumentsSection[page] = 'NOT COMPLETE';

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								`sectionStates.planningApplicationDocumentsSection.${page} must be one of the following values: ${Object.values(
									SECTION_STATE
								).join(', ')}`
							);
						});

						it('should throw an error when not given a value', async () => {
							delete appeal.sectionStates.planningApplicationDocumentsSection[page];

							await expect(() => update.validate(appeal, config)).rejects.toThrow(
								`sectionStates.planningApplicationDocumentsSection.${page} is a required field`
							);
						});
					});
				});
			});

			[
				'appealStatement',
				'plansDrawings',
				'newPlansDrawings',
				'supportingDocuments',
				'newSupportingDocuments'
			].forEach((page) => {
				describe(`sectionStates.appealDocumentsSection.${page}`, () => {
					it('should throw an error when given an invalid value', async () => {
						appeal.sectionStates.appealDocumentsSection[page] = 'NOT COMPLETE';

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`sectionStates.appealDocumentsSection.${page} must be one of the following values: ${Object.values(
								SECTION_STATE
							).join(', ')}`
						);
					});

					it('should throw an error when not given a value', async () => {
						delete appeal.sectionStates.appealDocumentsSection[page];

						await expect(() => update.validate(appeal, config)).rejects.toThrow(
							`sectionStates.appealDocumentsSection.${page} is a required field`
						);
					});
				});
			});
		});
	});
});
