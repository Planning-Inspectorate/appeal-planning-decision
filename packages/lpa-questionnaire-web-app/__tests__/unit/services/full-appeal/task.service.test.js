const { NOT_STARTED, CANNOT_START_YET } = require('../../../../src/services/common/task-statuses');
const {
  SECTIONS,
  TASK_SCOPE,
  getTaskStatus,
} = require('../../../../src/services/full-appeal/task.service');

describe('services/full-appeal/task.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('TASK_SCOPE', () => {
    it('should have expected defined constants', () => {
      expect(TASK_SCOPE).toEqual({
        DETERMINISTIC: 'deterministic',
        NON_DETERMINISTIC: 'nondeterministic',
        GENERIC: 'generic',
      });
    });
  });

  describe('SECTIONS', () => {
    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.procedureTypeReview.rule()).toEqual(NOT_STARTED);
    });
    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.issuesConstraintsDesignation.rule()).toEqual(NOT_STARTED);
    });

    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.environmentalImpactAssessment.rule()).toEqual(NOT_STARTED);
    });
    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.peopleNotification.rule()).toEqual(NOT_STARTED);
    });
    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.consultationResponse.rule()).toEqual(NOT_STARTED);
    });
    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.planningOfficerReport.rule()).toEqual(NOT_STARTED);
    });
    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.decisionNotice.rule()).toEqual(NOT_STARTED);
    });
    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.siteAccess.rule()).toEqual(NOT_STARTED);
    });
    it("should return 'NOT STARTED'", () => {
      expect(SECTIONS.additionalInformation.rule()).toEqual(NOT_STARTED);
    });
    it("should return 'CANNOT_START_YET'", () => {
      expect(SECTIONS.questionnaireSubmission.rule()).toEqual(CANNOT_START_YET);
    });
  });

  describe('getTaskStatus', () => {
    const ruleUnderTask = jest.fn();
    const ruleUnderSection = jest.fn();

    const sections = {
      section1: {
        task1: {
          rule: ruleUnderTask,
        },
        rule: ruleUnderSection,
      },
    };

    it('should find the rule in the task object if there is a taskName', () => {
      getTaskStatus({}, 'section1', 'task1', sections);
      expect(ruleUnderTask).toBeCalledTimes(1);
      expect(ruleUnderSection).toBeCalledTimes(0);
    });

    it('should find the rule in the section object if there is not a taskName', () => {
      getTaskStatus({}, 'section1', undefined, sections);
      expect(ruleUnderTask).toBeCalledTimes(0);
      expect(ruleUnderSection).toBeCalledTimes(1);
    });

    it('should return null if questionnaire param is not supplied', () => {
      const taskStatus = getTaskStatus(undefined, 'section1', undefined, sections);

      expect(ruleUnderSection).toBeCalledTimes(0);
      expect(taskStatus).toBeNull();
    });

    it('should return null if session param value is not supplied', () => {
      const taskStatus = getTaskStatus({}, undefined, undefined);

      expect(ruleUnderSection).toBeCalledTimes(0);
      expect(taskStatus).toBeNull();
    });
  });
});
