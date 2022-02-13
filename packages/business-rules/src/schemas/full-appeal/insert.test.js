const v8 = require('v8');
const { subMonths } = require('date-fns');
const appealData = require('../../../test/data/full-appeal');
const insert = require('./insert');
const {
  APPEAL_STATE,
  APPEAL_ID,
  APPLICATION_DECISION,
  APPLICATION_CATEGORIES,
  KNOW_THE_OWNERS,
  TYPE_OF_PLANNING_APPLICATION,
  I_AGREE,
  SECTION_STATE,
} = require('../../constants');

describe('schemas/full-appeal/insert', () => {
  const config = {};

  let appeal;
  let appeal2;

  beforeEach(() => {
    appeal = v8.deserialize(v8.serialize(appealData));
    appeal2 = v8.deserialize(v8.serialize(appealData));
  });

  describe('insert', () => {
    it('should return the data when given valid data', async () => {
      const result = await insert.validate(appeal, config);
      expect(result).toEqual(appeal);
    });

    it('should remove unknown fields', async () => {
      appeal2.unknownField = 'unknown field';

      const result = await insert.validate(appeal2, config);
      expect(result).toEqual(appeal);
    });

    describe('id', () => {
      it('should strip leading/trailing spaces', async () => {
        appeal2.id = '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
        appeal.id = '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a UUID', async () => {
        appeal.id = 'abc123';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'id must be a valid UUID',
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.id = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'id must be a `string` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.id;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'id is a required field',
        );
      });
    });

    describe('horizonId', () => {
      it('should throw an error when given a value with more than 20 characters', async () => {
        appeal.horizonId = 'a'.repeat(21);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'horizonId must be at most 20 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal.horizonId = '  abc123  ';

        const result = await insert.validate(appeal, config);
        expect(result).toEqual({
          ...appeal,
          horizonId: 'abc123',
        });
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.horizonId;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('lpaCode', () => {
      it('should throw an error when given a value with more than 20 characters', async () => {
        appeal.lpaCode = 'a'.repeat(21);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'lpaCode must be at most 20 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal.lpaCode = '  abc123  ';

        const result = await insert.validate(appeal, config);
        expect(result).toEqual({
          ...appeal,
          lpaCode: 'abc123',
        });
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.lpaCode;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('decisionDate', () => {
      it('should throw an error when given a value which is in an incorrect format', async () => {
        appeal.decisionDate = '03/07/2021';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'Invalid Date or string not ISO format',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.decisionDate;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('state', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.state = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `state must be one of the following values: ${Object.values(APPEAL_STATE).join(', ')}`,
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.state = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'state must be a `string` type, but the final value was: `null`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal2.state;

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual({
          ...appeal,
          state: 'DRAFT',
        });
      });
    });

    describe('appealType', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.appealType = '0001';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `appealType must be one of the following values: ${Object.values(APPEAL_ID).join(', ')}`,
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealType;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('decisionDate', () => {
      it('should throw an error when given a value which is in an incorrect format', async () => {
        appeal.decisionDate = '03/07/2021';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'Invalid Date or string not ISO format',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.decisionDate;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when appeal type and application decision is not passed', async () => {
        appeal.decisionDate = subMonths(new Date(), 1);
        delete appeal.appealType;
        delete appeal.eligibility.applicationDecision;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('typeOfPlanningApplication', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.typeOfPlanningApplication = 'appeal';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `typeOfPlanningApplication must be one of the following values: ${Object.values(
            TYPE_OF_PLANNING_APPLICATION,
          ).join(', ')}`,
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.typeOfPlanningApplication;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when given a null value', async () => {
        appeal.typeOfPlanningApplication = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('eligibility', () => {
      it('should remove unknown fields', async () => {
        appeal2.eligibility.unknownField = 'unknown field';

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'eligibility must be a `object` type, but the final value was: `null`',
        );
      });

      describe('eligibility.applicationCategories', () => {
        it('should throw an error when given an invalid value', async () => {
          appeal.eligibility.applicationCategories = 'appeal';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            `eligibility.applicationCategories must be one of the following values: ${Object.values(
              APPLICATION_CATEGORIES,
            ).join(', ')}`,
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.eligibility.applicationCategories;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when given a null value', async () => {
          appeal.eligibility.applicationCategories = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('eligibility.applicationDecision', () => {
        it('should throw an error when given an invalid value', async () => {
          appeal.eligibility.applicationDecision = 'appeal';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            `eligibility.applicationDecision must be one of the following values: ${Object.values(
              APPLICATION_DECISION,
            ).join(', ')}`,
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.eligibility.applicationDecision;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when given a null value', async () => {
          appeal.eligibility.applicationDecision = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('eligibility.enforcementNotice', () => {
        it('should throw an error when not given a boolean value', async () => {
          appeal.eligibility = {
            enforcementNotice: 'yes',
          };

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'eligibility.enforcementNotice must be a `boolean` type, but the final value was: `"yes"`',
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.eligibility.enforcementNotice;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      it('should not throw an error when multiple values are given', async () => {
        appeal.eligibility.applicationCategories = ['a_listed_building', 'major_dwellings'];

        const result = await insert.validate(appeal, config);
        appeal.eligibility.applicationCategories = null;
        expect(result).toEqual(appeal);
      });
    });

    describe('appealDocumentsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealDocumentsSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealDocumentsSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealDocumentsSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('appealDocumentsSection.appealStatement', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealDocumentsSection.appealStatement.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealDocumentsSection.appealStatement = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealDocumentsSection.appealStatement must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealDocumentsSection.appealStatement.uploadedFile', () => {
          it('should remove unknown fields', async () => {
            appeal2.appealDocumentsSection.appealStatement.uploadedFile.unknownField =
              'unknown field';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.appealDocumentsSection.appealStatement.uploadedFile = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealDocumentsSection.appealStatement.uploadedFile must be a `object` type, but the final value was: `null`',
            );
          });

          describe('appealDocumentsSection.appealStatement.uploadedFile.name', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.appealDocumentsSection.appealStatement.uploadedFile.name = 'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealDocumentsSection.appealStatement.uploadedFile.name must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.appealDocumentsSection.appealStatement.uploadedFile.name = '  test-pdf.pdf  ';
              appeal.appealDocumentsSection.appealStatement.uploadedFile.name = 'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealDocumentsSection.appealStatement.uploadedFile.name;
              appeal.appealDocumentsSection.appealStatement.uploadedFile.name = '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('appealDocumentsSection.appealStatement.uploadedFile.originalFileName', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.appealDocumentsSection.appealStatement.uploadedFile.originalFileName =
                'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealDocumentsSection.appealStatement.uploadedFile.originalFileName must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.appealDocumentsSection.appealStatement.uploadedFile.originalFileName =
                '  test-pdf.pdf  ';
              appeal.appealDocumentsSection.appealStatement.uploadedFile.originalFileName =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealDocumentsSection.appealStatement.uploadedFile.originalFileName;
              appeal.appealDocumentsSection.appealStatement.uploadedFile.originalFileName = '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('appealDocumentsSection.appealStatement.uploadedFile.id', () => {
            it('should strip leading/trailing spaces', async () => {
              appeal2.appealDocumentsSection.appealStatement.uploadedFile.id =
                '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
              appeal.appealDocumentsSection.appealStatement.uploadedFile.id =
                '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should throw an error when not given a UUID', async () => {
              appeal.appealDocumentsSection.appealStatement.uploadedFile.id = 'abc123';

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealDocumentsSection.appealStatement.uploadedFile.id must be a valid UUID',
              );
            });

            it('should not throw an error when given a null value', async () => {
              appeal.appealDocumentsSection.appealStatement.uploadedFile.id = null;

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealDocumentsSection.appealStatement.uploadedFile.id;
              appeal.appealDocumentsSection.appealStatement.uploadedFile.id = null;

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });
          });
        });

        describe('appealDocumentsSection.appealStatement.hasSensitiveInformation', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealDocumentsSection.appealStatement.hasSensitiveInformation = 'false ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealDocumentsSection.appealStatement.hasSensitiveInformation must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealDocumentsSection.appealStatement.hasSensitiveInformation = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealDocumentsSection.appealStatement.hasSensitiveInformation;
            appeal.appealDocumentsSection.appealStatement.hasSensitiveInformation = null;

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });
        });
      });

      describe('appealDocumentsSection.plansDrawings', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealDocumentsSection.plansDrawings.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealDocumentsSection.plansDrawings = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealDocumentsSection.plansDrawings must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealDocumentsSection.plansDrawings.hasPlansDrawings', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = 'true ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealDocumentsSection.plansDrawings.hasPlansDrawings must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealDocumentsSection.plansDrawings.hasPlansDrawings;
            appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = null;

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealDocumentsSection.plansDrawings.uploadedFile', () => {
          it('should remove unknown fields', async () => {
            appeal2.appealDocumentsSection.plansDrawings.uploadedFile.unknownField =
              'unknown field';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.appealDocumentsSection.plansDrawings.uploadedFile = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealDocumentsSection.plansDrawings.uploadedFile must be a `object` type, but the final value was: `null`',
            );
          });

          describe('appealDocumentsSection.plansDrawings.uploadedFile.name', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.name = 'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealDocumentsSection.plansDrawings.uploadedFile.name must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.appealDocumentsSection.plansDrawings.uploadedFile.name = '  test-pdf.pdf  ';
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.name = 'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealDocumentsSection.plansDrawings.uploadedFile.name;
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.name = '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('appealDocumentsSection.plansDrawings.uploadedFile.originalFileName', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.originalFileName =
                'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealDocumentsSection.plansDrawings.uploadedFile.originalFileName must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.appealDocumentsSection.plansDrawings.uploadedFile.originalFileName =
                '  test-pdf.pdf  ';
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.originalFileName =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealDocumentsSection.plansDrawings.uploadedFile.originalFileName;
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.originalFileName = '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('appealDocumentsSection.plansDrawings.uploadedFile.id', () => {
            it('should strip leading/trailing spaces', async () => {
              appeal2.appealDocumentsSection.plansDrawings.uploadedFile.id =
                '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.id =
                '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should throw an error when not given a UUID', async () => {
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.id = 'abc123';

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealDocumentsSection.plansDrawings.uploadedFile.id must be a valid UUID',
              );
            });

            it('should not throw an error when given a null value', async () => {
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.id = null;

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealDocumentsSection.plansDrawings.uploadedFile.id;
              appeal.appealDocumentsSection.plansDrawings.uploadedFile.id = null;

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });
          });
        });
      });

      describe('appealDocumentsSection.supportingDocuments', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealDocumentsSection.supportingDocuments.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealDocumentsSection.supportingDocuments = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealDocumentsSection.supportingDocuments must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealDocumentsSection.supportingDocuments.hasSupportingDocuments', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealDocumentsSection.supportingDocuments.hasSupportingDocuments = 'true ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealDocumentsSection.supportingDocuments.hasSupportingDocuments must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealDocumentsSection.supportingDocuments.hasSupportingDocuments = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealDocumentsSection.supportingDocuments.hasSupportingDocuments;
            appeal.appealDocumentsSection.supportingDocuments.hasSupportingDocuments = null;

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });
        });
      });
    });

    describe('contactDetailsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.contactDetailsSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.contactDetailsSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('contactDetailsSection.isOriginalApplicant', () => {
        it('should throw an error when not given a boolean value', async () => {
          appeal.contactDetailsSection = {
            isOriginalApplicant: 'yes',
          };

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'contactDetailsSection.isOriginalApplicant must be a `boolean` type, but the final value was: `"yes"`',
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.contactDetailsSection.isOriginalApplicant;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('contactDetailsSection.contact', () => {
        it('should remove unknown fields', async () => {
          appeal2.contactDetailsSection.contact.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.contactDetailsSection.contact = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'contactDetailsSection.contact must be a `object` type, but the final value was: `null`',
          );
        });

        describe('contactDetailsSection.contact.name', () => {
          it('should throw an error when not given a string value', async () => {
            appeal.contactDetailsSection.contact.name = 123;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `contactDetailsSection.contact.name must match the following: "/^[a-z\\-' ]+$/i"`,
            );
          });

          it('should throw an error when given a value with less than 2 characters', async () => {
            appeal.contactDetailsSection.contact.name = 'a';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'contactDetailsSection.contact.name must be at least 2 characters',
            );
          });

          it('should throw an error when given a value with more than 80 characters', async () => {
            appeal.contactDetailsSection.contact.name = 'a'.repeat(81);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'contactDetailsSection.contact.name must be at most 80 characters',
            );
          });

          it('should throw an error when given a value with invalid characters', async () => {
            appeal.contactDetailsSection.contact.name = '!?<>';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `contactDetailsSection.contact.name must match the following: "/^[a-z\\-' ]+$/i"`,
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.contactDetailsSection.contact.name;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('contactDetailsSection.contact.email', () => {
          it('should throw an error when not given an email value', async () => {
            appeal.contactDetailsSection.contact.email = 'apellant@example';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'contactDetailsSection.contact.email must be a valid email',
            );
          });

          it('should throw an error when given a value with more than 255 characters', async () => {
            appeal.contactDetailsSection.contact.email = `${'a'.repeat(244)}@example.com`;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'contactDetailsSection.contact.email must be at most 255 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.contactDetailsSection.contact.email;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('contactDetailsSection.contact.companyName', () => {
          it('should throw an error when given a value with more than 50 characters', async () => {
            appeal.contactDetailsSection.contact.companyName = 'a'.repeat(51);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'contactDetailsSection.contact.companyName must be at most 50 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.contactDetailsSection.contact.companyName;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });

      describe('contactDetailsSection.appealingOnBehalfOf', () => {
        it('should remove unknown fields', async () => {
          appeal2.contactDetailsSection.appealingOnBehalfOf.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.contactDetailsSection.appealingOnBehalfOf = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'contactDetailsSection.appealingOnBehalfOf must be a `object` type, but the final value was: `null`',
          );
        });

        describe('contactDetailsSection.appealingOnBehalfOf.name', () => {
          it('should throw an error when not given a string value', async () => {
            appeal.contactDetailsSection.appealingOnBehalfOf.name = 123;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `contactDetailsSection.appealingOnBehalfOf.name must match the following: "/^[a-z\\-' ]*$/i"`,
            );
          });

          it('should throw an error when given a value with more than 80 characters', async () => {
            appeal.contactDetailsSection.appealingOnBehalfOf.name = 'a'.repeat(81);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'contactDetailsSection.appealingOnBehalfOf.name must be at most 80 characters',
            );
          });

          it('should throw an error when given a value with invalid characters', async () => {
            appeal.contactDetailsSection.appealingOnBehalfOf.name = '!?<>';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `contactDetailsSection.appealingOnBehalfOf.name must match the following: "/^[a-z\\-' ]*$/i"`,
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.contactDetailsSection.appealingOnBehalfOf.name;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('contactDetailsSection.appealingOnBehalfOf.companyName', () => {
          it('should not throw an error when not given a value', async () => {
            delete appeal.contactDetailsSection.appealingOnBehalfOf.companyName;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });
    });

    describe('appealSiteSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('appealSiteSection.siteAddress', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealSiteSection.siteAddress.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealSiteSection.siteAddress = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.siteAddress must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealSiteSection.siteAddress.addressLine1', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.addressLine1 = 'a'.repeat(61);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.addressLine1 must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.addressLine1;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.addressLine2', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.addressLine2 = 'a'.repeat(61);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.addressLine2 must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.addressLine2;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.town', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.town = 'a'.repeat(61);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.town must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.town;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.county', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.county = 'a'.repeat(61);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.county must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.county;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.postcode', () => {
          it('should throw an error when given a value with more than 8 characters', async () => {
            appeal.appealSiteSection.siteAddress.postcode = 'a'.repeat(9);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.postcode must be at most 8 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.postcode;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });

      describe('appealSiteSection.siteOwnership', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealSiteSection.siteOwnership.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealSiteSection.siteOwnership = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.siteOwnership must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealSiteSection.siteOwnership.ownsSomeOfTheLand', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand = 'false ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteOwnership.ownsSomeOfTheLand must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteOwnership.ownsAllTheLand', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealSiteSection.siteOwnership.ownsAllTheLand = 'true ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteOwnership.ownsAllTheLand must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.siteOwnership.ownsAllTheLand = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteOwnership.ownsAllTheLand;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteOwnership.knowsTheOwners', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.appealSiteSection.siteOwnership.knowsTheOwners = 'perhaps';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `appealSiteSection.siteOwnership.knowsTheOwners must be one of the following values: ${Object.values(
                KNOW_THE_OWNERS,
              ).join(', ')}`,
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteOwnership.knowsTheOwners;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.siteOwnership.knowsTheOwners = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteOwnership.hasIdentifiedTheOwners', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.appealSiteSection.siteOwnership.hasIdentifiedTheOwners = 'not valid';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `appealSiteSection.siteOwnership.hasIdentifiedTheOwners must be one of the following values: ${I_AGREE}`,
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteOwnership.hasIdentifiedTheOwners;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.siteOwnership.hasIdentifiedTheOwners = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });

      describe('appealSiteSection.agriculturalHolding', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealSiteSection.agriculturalHolding.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealSiteSection.agriculturalHolding = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.agriculturalHolding must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealSiteSection.agriculturalHolding.isAgriculturalHolding', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealSiteSection.agriculturalHolding.isAgriculturalHolding = 'true ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.agriculturalHolding.isAgriculturalHolding must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.agriculturalHolding.isAgriculturalHolding = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.agriculturalHolding.isAgriculturalHolding;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.agriculturalHolding.isTenant', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealSiteSection.agriculturalHolding.isTenant = 'true ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.agriculturalHolding.isTenant must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.agriculturalHolding.isTenant = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.agriculturalHolding.isTenant;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.agriculturalHolding.hasOtherTenants', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealSiteSection.agriculturalHolding.hasOtherTenants = 'true ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.agriculturalHolding.hasOtherTenants must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.agriculturalHolding.hasOtherTenants = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.agriculturalHolding.hasOtherTenants;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });

      describe('appealSiteSection.visibleFromRoad', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealSiteSection.visibleFromRoad.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealSiteSection.visibleFromRoad = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.visibleFromRoad must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealSiteSection.visibleFromRoad.isVisible', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealSiteSection.visibleFromRoad.isVisible = 'false ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.visibleFromRoad.isVisible must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.visibleFromRoad.isVisible = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.visibleFromRoad.isVisible;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.visibleFromRoad.details', () => {
          it('should throw an error when not given a value and appealSiteSection.visibleFromRoad.isVisible is false', async () => {
            appeal.appealSiteSection.visibleFromRoad.isVisible = false;
            appeal.appealSiteSection.visibleFromRoad.details = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'Tell us how visibility is restricted',
            );
          });

          it('should throw an error when given a value longer than 255 chars and appealSiteSection.visibleFromRoad.isVisible is false', async () => {
            appeal.appealSiteSection.visibleFromRoad.isVisible = false;
            appeal.appealSiteSection.visibleFromRoad.details = 'a'.repeat(256);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'How visibility is restricted must be 255 characters or less',
            );
          });

          it('should not throw an error when given a null value and appealSiteSection.visibleFromRoad.isVisible is true', async () => {
            appeal.appealSiteSection.visibleFromRoad.isVisible = true;
            appeal.appealSiteSection.visibleFromRoad.details = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });

      describe('appealSiteSection.healthAndSafety', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealSiteSection.healthAndSafety.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealSiteSection.healthAndSafety = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.healthAndSafety must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealSiteSection.healthAndSafety.hasIssues', () => {
          it('should throw an error when not given a boolean', async () => {
            appeal.appealSiteSection.healthAndSafety.hasIssues = 'true ';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.healthAndSafety.hasIssues must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSiteSection.healthAndSafety.hasIssues = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.healthAndSafety.hasIssues;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.healthAndSafety.details', () => {
          it('should throw an error when not given a value and appealSiteSection.healthAndSafety.hasIssues is true', async () => {
            appeal.appealSiteSection.healthAndSafety.hasIssues = true;
            appeal.appealSiteSection.healthAndSafety.details = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'Tell us about the health and safety issues',
            );
          });

          it('should throw an error when given a value longer than 255 chars and appealSiteSection.healthAndSafety.hasIssues is true', async () => {
            appeal.appealSiteSection.healthAndSafety.hasIssues = true;
            appeal.appealSiteSection.healthAndSafety.details = 'a'.repeat(256);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'Health and safety information must be 255 characters or less',
            );
          });

          it('should not throw an error when given a null value and appealSiteSection.healthAndSafety.hasIssues is false', async () => {
            appeal.appealSiteSection.healthAndSafety.hasIssues = false;
            appeal.appealSiteSection.healthAndSafety.details = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });
    });

    describe('planningApplicationDocumentsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.planningApplicationDocumentsSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.planningApplicationDocumentsSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'planningApplicationDocumentsSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('planningApplicationDocumentsSection.applicationNumber', () => {
        it('should throw an error when given a value with more than 30 characters', async () => {
          appeal.planningApplicationDocumentsSection.applicationNumber = 'a'.repeat(31);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.applicationNumber must be at most 30 characters',
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.applicationNumber;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.unknownField =
            'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication must be a `object` type, but the final value was: `null`',
          );
        });

        describe('planningApplicationDocumentsSection.originalApplication.uploadedFile', () => {
          it('should remove unknown fields', async () => {
            appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.unknownField =
              'unknown field';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'planningApplicationDocumentsSection.originalApplication.uploadedFile must be a `object` type, but the final value was: `null`',
            );
          });

          describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.name', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
                'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.originalApplication.uploadedFile.name must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
                '  test-pdf.pdf  ';
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile
                .name;
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name = '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
                'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
                '  test-pdf.pdf  ';
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile
                .originalFileName;
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
                '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.id', () => {
            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
                '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
                '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should throw an error when not given a UUID', async () => {
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
                'abc123';

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.originalApplication.uploadedFile.id must be a valid UUID',
              );
            });

            it('should not throw an error when given a null value', async () => {
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id = null;

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile
                .id;
              appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id = null;

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });
          });
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter must be a `object` type, but the final value was: `null`',
          );
        });

        describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile', () => {
          it('should remove unknown fields', async () => {
            appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.unknownField =
              'unknown field';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'planningApplicationDocumentsSection.decisionLetter.uploadedFile must be a `object` type, but the final value was: `null`',
            );
          });

          describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.name', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
                'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.decisionLetter.uploadedFile.name must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
                '  test-pdf.pdf  ';
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name;
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name = '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
                'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
                '  test-pdf.pdf  ';
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile
                .originalFileName;
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
                '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.id', () => {
            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id =
                '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id =
                '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should throw an error when not given a UUID', async () => {
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id = 'abc123';

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.decisionLetter.uploadedFile.id must be a valid UUID',
              );
            });

            it('should not throw an error when given a null value', async () => {
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id = null;

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id;
              appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id = null;

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });
          });
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.unknownField =
            'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement must be a `object` type, but the final value was: `null`',
          );
        });

        describe('planningApplicationDocumentsSection.designAccessStatement.isSubmitted', () => {
          it('should throw an error when not given a boolean value', async () => {
            appeal.planningApplicationDocumentsSection.designAccessStatement = {
              isSubmitted: 'yes',
            };

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'planningApplicationDocumentsSection.designAccessStatement.isSubmitted must be a `boolean` type, but the final value was: `"yes"`',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.planningApplicationDocumentsSection.designAccessStatement.isSubmitted;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile', () => {
          it('should remove unknown fields', async () => {
            appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.unknownField =
              'unknown field';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'planningApplicationDocumentsSection.designAccessStatement.uploadedFile must be a `object` type, but the final value was: `null`',
            );
          });

          describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
                'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
                '  test-pdf.pdf  ';
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
                .name;
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
                '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
                'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
                '  test-pdf.pdf  ';
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
                .originalFileName;
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
                '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id', () => {
            it('should strip leading/trailing spaces', async () => {
              appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
                '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
                '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should throw an error when not given a UUID', async () => {
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
                'abc123';

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id must be a valid UUID',
              );
            });

            it('should not throw an error when given a null value', async () => {
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
                null;

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
                .id;
              appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
                null;

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });
          });
        });
      });
    });

    describe('appealSubmission', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSubmission.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSubmission = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSubmission must be a `object` type, but the final value was: `null`',
        );
      });

      describe('appealSubmission.appealPDFStatement', () => {
        it('should remove unknown fields', async () => {
          appeal2.appealSubmission.appealPDFStatement.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.appealSubmission.appealPDFStatement = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealSubmission.appealPDFStatement must be a `object` type, but the final value was: `null`',
          );
        });

        describe('appealSubmission.appealPDFStatement.uploadedFile', () => {
          it('should remove unknown fields', async () => {
            appeal2.appealSubmission.appealPDFStatement.uploadedFile.unknownField = 'unknown field';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.appealSubmission.appealPDFStatement.uploadedFile = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSubmission.appealPDFStatement.uploadedFile must be a `object` type, but the final value was: `null`',
            );
          });

          describe('appealSubmission.appealPDFStatement.uploadedFile.name', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.appealSubmission.appealPDFStatement.uploadedFile.name = 'a'.repeat(256);

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealSubmission.appealPDFStatement.uploadedFile.name must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.appealSubmission.appealPDFStatement.uploadedFile.name = '  test-pdf.pdf  ';
              appeal.appealSubmission.appealPDFStatement.uploadedFile.name = 'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.name;
              appeal.appealSubmission.appealPDFStatement.uploadedFile.name = '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('appealSubmission.appealPDFStatement.uploadedFile.originalFileName', () => {
            it('should throw an error when given a value with more than 255 characters', async () => {
              appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName = 'a'.repeat(
                256,
              );

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealSubmission.appealPDFStatement.uploadedFile.originalFileName must be at most 255 characters',
              );
            });

            it('should strip leading/trailing spaces', async () => {
              appeal2.appealSubmission.appealPDFStatement.uploadedFile.originalFileName =
                '  test-pdf.pdf  ';
              appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName =
                'test-pdf.pdf';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.originalFileName;
              appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName = '';

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });
          });

          describe('appealSubmission.appealPDFStatement.uploadedFile.id', () => {
            it('should strip leading/trailing spaces', async () => {
              appeal2.appealSubmission.appealPDFStatement.uploadedFile.id =
                '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
              appeal.appealSubmission.appealPDFStatement.uploadedFile.id =
                '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });

            it('should throw an error when not given a UUID', async () => {
              appeal.appealSubmission.appealPDFStatement.uploadedFile.id = 'abc123';

              await expect(() => insert.validate(appeal, config)).rejects.toThrow(
                'appealSubmission.appealPDFStatement.uploadedFile.id must be a valid UUID',
              );
            });

            it('should not throw an error when given a null value', async () => {
              appeal.appealSubmission.appealPDFStatement.uploadedFile.id = null;

              const result = await insert.validate(appeal, config);
              expect(result).toEqual(appeal);
            });

            it('should not throw an error when not given a value', async () => {
              delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.id;
              appeal.appealSubmission.appealPDFStatement.uploadedFile.id = null;

              const result = await insert.validate(appeal2, config);
              expect(result).toEqual(appeal);
            });
          });
        });
      });
    });

    describe('sectionStates', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates must be a `object` type, but the final value was: `null`',
        );
      });

      describe('sectionStates.contactDetailsSection', () => {
        it('should remove unknown fields', async () => {
          appeal2.sectionStates.contactDetailsSection.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.sectionStates.contactDetailsSection = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'sectionStates.contactDetailsSection must be a `object` type, but the final value was: `null`',
          );
        });

        describe('sectionStates.contactDetailsSection.isOriginalApplicant', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.contactDetailsSection.isOriginalApplicant = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.contactDetailsSection.isOriginalApplicant must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.contactDetailsSection.isOriginalApplicant;

            appeal2.sectionStates.contactDetailsSection.isOriginalApplicant =
              SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.contactDetailsSection.contact', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.contactDetailsSection.contact = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.contactDetailsSection.contact must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.contactDetailsSection.contact;

            appeal2.sectionStates.contactDetailsSection.contact = SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.contactDetailsSection.appealingOnBehalfOf', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.contactDetailsSection.appealingOnBehalfOf = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.contactDetailsSection.appealingOnBehalfOf must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.contactDetailsSection.appealingOnBehalfOf;

            appeal2.sectionStates.contactDetailsSection.appealingOnBehalfOf =
              SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });
      });

      describe('sectionStates.appealSiteSection', () => {
        it('should remove unknown fields', async () => {
          appeal2.sectionStates.appealSiteSection.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.sectionStates.appealSiteSection = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'sectionStates.appealSiteSection must be a `object` type, but the final value was: `null`',
          );
        });

        describe('sectionStates.appealSiteSection.siteAddress', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.appealSiteSection.siteAddress = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.appealSiteSection.siteAddress must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.appealSiteSection.siteAddress;

            appeal2.sectionStates.appealSiteSection.siteAddress = SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.appealSiteSection.siteOwnership', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.appealSiteSection.siteOwnership = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.appealSiteSection.siteOwnership must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.appealSiteSection.siteOwnership;

            appeal2.sectionStates.appealSiteSection.siteOwnership = SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.appealSiteSection.agriculturalHolding', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.appealSiteSection.agriculturalHolding = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.appealSiteSection.agriculturalHolding must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.appealSiteSection.agriculturalHolding;

            appeal2.sectionStates.appealSiteSection.agriculturalHolding = SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.appealSiteSection.visibleFromRoad', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.appealSiteSection.visibleFromRoad = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.appealSiteSection.visibleFromRoad must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.appealSiteSection.visibleFromRoad;

            appeal2.sectionStates.appealSiteSection.visibleFromRoad = SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.appealSiteSection.healthAndSafety', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.appealSiteSection.healthAndSafety = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.appealSiteSection.healthAndSafety must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.appealSiteSection.healthAndSafety;

            appeal2.sectionStates.appealSiteSection.healthAndSafety = SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });
      });

      describe('sectionStates.planningApplicationDocumentsSection', () => {
        it('should remove unknown fields', async () => {
          appeal2.sectionStates.planningApplicationDocumentsSection.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.sectionStates.planningApplicationDocumentsSection = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'sectionStates.planningApplicationDocumentsSection must be a `object` type, but the final value was: `null`',
          );
        });

        describe('sectionStates.planningApplicationDocumentsSection.applicationNumber', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.planningApplicationDocumentsSection.applicationNumber =
              'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.planningApplicationDocumentsSection.applicationNumber must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.planningApplicationDocumentsSection.applicationNumber;

            appeal2.sectionStates.planningApplicationDocumentsSection.applicationNumber =
              SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.planningApplicationDocumentsSection.originalApplication', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.planningApplicationDocumentsSection.originalApplication =
              'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.planningApplicationDocumentsSection.originalApplication must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.planningApplicationDocumentsSection.originalApplication;

            appeal2.sectionStates.planningApplicationDocumentsSection.originalApplication =
              SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.planningApplicationDocumentsSection.decisionLetter', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.planningApplicationDocumentsSection.decisionLetter =
              'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.planningApplicationDocumentsSection.decisionLetter must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.planningApplicationDocumentsSection.decisionLetter;

            appeal2.sectionStates.planningApplicationDocumentsSection.decisionLetter =
              SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.planningApplicationDocumentsSection.designAccessStatement', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatement =
              'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.planningApplicationDocumentsSection.designAccessStatement must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatement;

            appeal2.sectionStates.planningApplicationDocumentsSection.designAccessStatement =
              SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });
      });

      describe('sectionStates.appealDocumentsSection', () => {
        it('should remove unknown fields', async () => {
          appeal2.sectionStates.appealDocumentsSection.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.sectionStates.appealDocumentsSection = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'sectionStates.appealDocumentsSection must be a `object` type, but the final value was: `null`',
          );
        });

        describe('sectionStates.appealDocumentsSection.appealStatement', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.appealDocumentsSection.appealStatement = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.appealDocumentsSection.appealStatement must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.appealDocumentsSection.appealStatement;

            appeal2.sectionStates.appealDocumentsSection.appealStatement =
              SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });

        describe('sectionStates.appealDocumentsSection.plansDrawings', () => {
          it('should throw an error when given an invalid value', async () => {
            appeal.sectionStates.appealDocumentsSection.plansDrawings = 'NOT COMPLETE';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `sectionStates.appealDocumentsSection.plansDrawings must be one of the following values: ${Object.values(
                SECTION_STATE,
              ).join(', ')}`,
            );
          });

          it('should set a default value of `NOT STARTED` when not given a value', async () => {
            delete appeal.sectionStates.appealDocumentsSection.plansDrawings;

            appeal2.sectionStates.appealDocumentsSection.plansDrawings = SECTION_STATE.NOT_STARTED;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal2);
          });
        });
      });
    });
  });
});
