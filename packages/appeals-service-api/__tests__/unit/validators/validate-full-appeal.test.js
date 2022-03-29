const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const {
  constants: { APPEAL_STATE, APPLICATION_DECISION, KNOW_THE_OWNERS, PROCEDURE_TYPE },
} = require('@pins/business-rules');
const v8 = require('v8');
const validateFullAppeal = require('../../../src/validators/validate-full-appeal');

describe('validators/validate-full-appeal', () => {
  let appeal;

  beforeEach(() => {
    appeal = v8.deserialize(v8.serialize(fullAppeal));
  });

  it('should return no errors when given valid data', () => {
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([]);
  });

  it('should return no errors when the appeal has not been submitted', () => {
    appeal.state = APPEAL_STATE.DRAFT;
    appeal.contactDetailsSection.isOriginalApplicant = false;
    appeal.contactDetailsSection.appealingOnBehalfOf.name = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([]);
  });

  it('should return an error if the isOriginalApplicant = false and appealingOnBehalfOf.name = null', () => {
    appeal.contactDetailsSection.isOriginalApplicant = false;
    appeal.contactDetailsSection.appealingOnBehalfOf.name = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      "If you are appealing on behalf of the applicant then the applicant's name is required",
    ]);
  });

  it('should return an error if ownsAllTheLand = false and ownsSomeOfTheLand = null', () => {
    appeal.appealSiteSection.siteOwnership.ownsAllTheLand = false;
    appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      "If you don't own all the land then you must specify if you own some of the land",
    ]);
  });

  it('should return an error if ownsAllTheLand = false and knowsTheOwners = null', () => {
    appeal.appealSiteSection.siteOwnership.ownsAllTheLand = false;
    appeal.appealSiteSection.siteOwnership.knowsTheOwners = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      "If you don't own all the land then you must specify if you know who owns the land",
    ]);
  });

  it('should return an error if knowsTheOwners = yes and tellingTheLandowners = null', () => {
    appeal.appealSiteSection.siteOwnership.knowsTheOwners = KNOW_THE_OWNERS.YES;
    appeal.appealSiteSection.siteOwnership.tellingTheLandowners = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you know who owns all of the land then you must confirm that you have told the other landowners',
    ]);
  });

  it('should return an error if knowsTheOwners = some and hasIdentifiedTheOwners = null', () => {
    appeal.appealSiteSection.siteOwnership.knowsTheOwners = KNOW_THE_OWNERS.SOME;
    appeal.appealSiteSection.siteOwnership.hasIdentifiedTheOwners = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you know who owns some of the land then you must confirm that you have identified the other landowners',
    ]);
  });

  it('should return an error if knowsTheOwners = some and advertisingYourAppeal = null', () => {
    appeal.appealSiteSection.siteOwnership.knowsTheOwners = KNOW_THE_OWNERS.SOME;
    appeal.appealSiteSection.siteOwnership.advertisingYourAppeal = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you know who owns some of the land then you must confirm that you have advertised your appeal',
    ]);
  });

  it('should return an error if knowsTheOwners = no and hasIdentifiedTheOwners = null', () => {
    appeal.appealSiteSection.siteOwnership.knowsTheOwners = KNOW_THE_OWNERS.NO;
    appeal.appealSiteSection.siteOwnership.hasIdentifiedTheOwners = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      "If you don't know who owns the land then you must confirm that you have identified the other landowners",
    ]);
  });

  it('should return an error if knowsTheOwners = no and advertisingYourAppeal = null', () => {
    appeal.appealSiteSection.siteOwnership.knowsTheOwners = KNOW_THE_OWNERS.NO;
    appeal.appealSiteSection.siteOwnership.advertisingYourAppeal = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      "If you don't know who owns the land then you must confirm that you have advertised your appeal",
    ]);
  });

  it('should return an error if isAgriculturalHolding = true and isTenant = null', () => {
    appeal.appealSiteSection.agriculturalHolding.isTenant = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If the appeal site is part of an agricultural holding then you must confirm if you are a tenant',
    ]);
  });

  it('should return an error if isTenant = true and hasOtherTenants = null', () => {
    appeal.appealSiteSection.agriculturalHolding.isTenant = true;
    appeal.appealSiteSection.agriculturalHolding.hasOtherTenants = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you are a tenant of the agricultural holding then you must confirm if there are any other tenants',
    ]);
  });

  it('should return an error if isAgriculturalHolding = true and tellingTheTenants = null', () => {
    appeal.appealSiteSection.agriculturalHolding.tellingTheTenants = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If the appeal site is part of an agricultural holding then you must confirm that you have told the other tenants',
    ]);
  });

  it('should return an error if procedureType = hearing and hearing.reason = null', () => {
    appeal.appealDecisionSection.procedureType = PROCEDURE_TYPE.HEARING;
    appeal.appealDecisionSection.hearing.reason = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you would prefer your appeal to be decided by hearing then you must give a reason',
    ]);
  });

  it('should return an error if procedureType = hearing and draftStatementOfCommonGround.uploadedFile = {}', () => {
    appeal.appealDecisionSection.procedureType = PROCEDURE_TYPE.HEARING;
    appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile = {};
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you would prefer your appeal to be decided by hearing then you must upload your draft statement of common ground',
    ]);
  });

  it('should return an error if procedureType = inquiry and inquiry.reason = null', () => {
    appeal.appealDecisionSection.procedureType = PROCEDURE_TYPE.INQUIRY;
    appeal.appealDecisionSection.inquiry.reason = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you would prefer your appeal to be decided by inquiry then you must give a reason',
    ]);
  });

  it('should return an error if procedureType = inquiry and inquiry.expectedDays = null', () => {
    appeal.appealDecisionSection.procedureType = PROCEDURE_TYPE.INQUIRY;
    appeal.appealDecisionSection.inquiry.expectedDays = null;
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you would prefer your appeal to be decided by inquiry then you must enter the number of days you expect the inquriy to last',
    ]);
  });

  it('should return an error if procedureType = inquiry and draftStatementOfCommonGround.uploadedFile = {}', () => {
    appeal.appealDecisionSection.procedureType = PROCEDURE_TYPE.INQUIRY;
    appeal.appealDecisionSection.draftStatementOfCommonGround.uploadedFile = {};
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If you would prefer your appeal to be decided by inquiry then you must upload your draft statement of common ground',
    ]);
  });

  it('should return an error if designAccessStatement.isSubmitted = true and designAccessStatement.uploadedFile = {}', () => {
    appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile = {};
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'Your design and access statement must be uploaded if you submitted one with your application',
    ]);
  });

  it('should return an error if plansDrawings.hasPlansDrawings = true and plansDrawings.uploadedFiles = []', () => {
    appeal.appealDocumentsSection.plansDrawings.uploadedFiles = [];
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual(['Your new plans and drawings must be uploaded']);
  });

  it('should return an error if supportingDocuments.hasSupportingDocuments = true and supportingDocuments.uploadedFiles = []', () => {
    appeal.appealDocumentsSection.supportingDocuments.uploadedFiles = [];
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual(['Your other new supporting documents must be uploaded']);
  });

  it('should return an error if applicationDecision = granted and decisionLetter.uploadedFile = {}', () => {
    appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile = {};
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If your planning application was granted then you must upload the decision letter',
    ]);
  });

  it('should return an error if applicationDecision = refused and decisionLetter.uploadedFile = {}', () => {
    appeal.eligibility.applicationDecision = APPLICATION_DECISION.REFUSED;
    appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile = {};
    const errors = validateFullAppeal(appeal);
    expect(errors).toEqual([
      'If your planning application was refused then you must upload the decision letter',
    ]);
  });
});
