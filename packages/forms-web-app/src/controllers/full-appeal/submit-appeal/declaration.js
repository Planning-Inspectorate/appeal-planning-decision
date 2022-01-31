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
  req.session.appeal.aboutYouSection.yourDetails.name = 'name surname';
  req.session.appeal.aboutYouSection.yourDetails.email =
    'AppealPlanningDecisionTest@planninginspectorate.gov.uk';
  req.session.appeal.beforeYouStartSection = {
    typeOfPlanningApplication: 'full-appeal',
  };
  req.session.appeal.appealSiteSection.ownsSomeOfTheLand = false;
  req.session.appeal.appealSiteSection.isAgriculturalHolding = false;
  req.session.appeal.appealSiteSection.isAgriculturalHoldingTenant = false;
  req.session.appeal.appealSiteSection.isVisibleFromRoad = true;
  req.session.appeal.appealSiteSection.areOtherTenants = false;
  req.session.appeal.appealSiteSection.knowsTheOwners = 'yes';
  req.session.appeal.planningApplicationDocumentsSection.applicationNumber = '12345';
  req.session.appeal.planningApplicationDocumentsSection.isDesignAccessStatementSubmitted = false;
  req.session.appeal.planningApplicationDocumentsSection.originalApplication = {
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
    },
  };
  req.session.appeal.planningApplicationDocumentsSection.designAccessStatement = {
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
    },
  };
  req.session.appeal.planningApplicationDocumentsSection.decisionLetter = {
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
    },
  };
  req.session.appeal.yourAppealSection.appealStatement = {
    uploadedFile: {
      name: 'sdsdsd',
      id: '32fdcb44-a6ab-4b9e-a9ca-68976ec81ad3',
      originalFileName: 'sdsdsds',
    },
    hasSensitiveInformation: false,
  };
  req.session.appeal.sectionStates = {
    aboutYouSection: {
      yourDetails: 'COMPLETED',
    },
    requiredDocumentsSection: {
      applicationNumber: 'COMPLETED',
      originalApplication: 'COMPLETED',
      decisionLetter: 'COMPLETED',
    },
    yourAppealSection: {
      appealStatement: 'COMPLETED',
      otherDocuments: 'COMPLETED',
    },
    appealSiteSection: {
      siteAddress: 'COMPLETED',
      siteAccess: 'COMPLETED',
      siteOwnership: 'COMPLETED',
      healthAndSafety: 'COMPLETED',
      ownsSomeOfTheLand: 'COMPLETED',
      ownsAllTheLand: 'COMPLETED',
    },
    contactDetailsSection: 'COMPLETED',
    aboutAppealSiteSection: 'COMPLETED',
    planningApplicationDocumentsSection: {
      isDesignAccessStatementSubmitted: 'COMPLETED',
      originalApplication: 'COMPLETED',
      decisionLetter: 'COMPLETED',
      designAccessStatement: 'COMPLETED',
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
