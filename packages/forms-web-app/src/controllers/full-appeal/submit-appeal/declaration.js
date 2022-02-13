const uuid = require('uuid');
const { storePdfAppeal } = require('../../../services/pdf.service');
const { VIEW } = require('../../../lib/full-appeal/views');
const { submitAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');

const {
  FULL_APPEAL: { DECLARATION: currentPage, APPEAL_SUBMITTED },
} = VIEW;

exports.getDeclaration = (req, res) => {
  req.session.appeal.appealType = '1005';
  res.render(currentPage);
};

exports.postDeclaration = async (req, res) => {
  req.session.appeal.appealType = '1005';
  req.session.appeal.lpaCode = 'E69999999';
  req.session.appeal.decisionDate = new Date();
  req.session.appeal.eligibility.applicationDecision = 'refused';
  req.session.appeal.eligibility.applicationCategories = 'none_of_these';
  req.session.appeal.eligibility.enforcementNotice = false;
  req.session.appeal.eligibility.typeOfPlanningApplication = 'full-appeal';
  req.session.appeal.contactDetailsSection.contact.name = 'name surname';
  req.session.appeal.contactDetailsSection.contact.email =
    'AppealPlanningDecisionTest@planninginspectorate.gov.uk';
  req.session.appeal.appealSiteSection.siteOwnership.ownsSomeOfTheLand = false;
  req.session.appeal.appealSiteSection.siteOwnership.knowsTheOwners = 'yes';
  req.session.appeal.appealSiteSection.agriculturalHolding.isAgriculturalHolding = false;
  req.session.appeal.appealSiteSection.agriculturalHolding.isTenant = false;
  req.session.appeal.appealSiteSection.agriculturalHolding.hasOtherTenants = false;
  req.session.appeal.appealSiteSection.visibleFromRoad.isVisible = true;
  req.session.appeal.planningApplicationDocumentsSection.applicationNumber = '12345';
  req.session.appeal.planningApplicationDocumentsSection.designAccessStatement.isSubmitted = false;
  req.session.appeal.planningApplicationDocumentsSection.originalApplication = {
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
      fileName: 'originalApplication.pdf',
      location: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282/originalApplication.pdf',
      size: 1000,
    },
  };
  req.session.appeal.planningApplicationDocumentsSection.designAccessStatement = {
    isSubmitted: true,
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
      fileName: 'originalApplication.pdf',
      location: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282/originalApplication.pdf',
      size: 1000,
    },
  };
  req.session.appeal.planningApplicationDocumentsSection.decisionLetter = {
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
      fileName: 'originalApplication.pdf',
      location: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282/originalApplication.pdf',
      size: 1000,
    },
  };
  req.session.appeal.appealDocumentsSection.appealStatement = {
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
      fileName: 'originalApplication.pdf',
      location: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282/originalApplication.pdf',
      size: 1000,
    },
    hasSensitiveInformation: false,
  };
  req.session.appeal.appealDocumentsSection.plansDrawings = {
    hasPlansDrawings: false,
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
      fileName: 'plansDrawings.pdf',
      location: '372c8ba6-dfa6-4bba-bf9c-b024e3d8c282/plansDrawings.pdf',
      size: 1000,
    },
  };
  req.session.appeal.sectionStates = {
    contactDetailsSection: {
      isOriginalApplicant: 'COMPLETED',
      contact: 'COMPLETED',
      appealingOnBehalfOf: 'COMPLETED',
    },
    appealSiteSection: {
      siteAddress: 'COMPLETED',
      siteOwnership: 'COMPLETED',
      agriculturalHolding: 'COMPLETED',
      visibleFromRoad: 'COMPLETED',
      healthAndSafety: 'COMPLETED',
    },
    planningApplicationDocumentsSection: {
      applicationNumber: 'COMPLETED',
      originalApplication: 'COMPLETED',
      decisionLetter: 'COMPLETED',
      designAccessStatement: 'COMPLETED',
    },
    appealDocumentsSection: {
      appealStatement: 'COMPLETED',
      plansDrawings: 'COMPLETED',
    },
  };

  const { body } = req;
  const { errors = {} } = body;
  const { appeal } = req.session;

  const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

  log.info('Submitting the appeal');

  try {
    const { id, name, location, size } = await storePdfAppeal(appeal);

    appeal.state = 'SUBMITTED';

    appeal.appealSubmission = {
      appealPDFStatement: {
        uploadedFile: {
          id,
          name,
          fileName: name,
          originalFileName: name,
          location,
          size,
        },
      },
    };

    req.session.appeal = await submitAppeal(appeal);
    log.debug('Appeal successfully submitted');
    res.redirect(`/${APPEAL_SUBMITTED}`);
  } catch (e) {
    log.error({ e }, 'The appeal submission failed');
    res.render(currentPage, {
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
  }
};
