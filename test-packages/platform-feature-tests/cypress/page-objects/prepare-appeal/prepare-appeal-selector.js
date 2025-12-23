export class PrepareAppealSelector {

    _selectors = {

        emailCode: '#email-code',
        applicationReference: '#applicationReference',
        applicationNumber: 'application-number',
        emailAddress: 'email-address',
        onApplicationDateDay: '#onApplicationDate_day',
        onApplicationDateMonth: '#onApplicationDate_month',
        onApplicationDateYear: '#onApplicationDate_year',
        developmentDescriptionOriginal: '#developmentDescriptionOriginal',
        govukFieldsetHeading: ".govuk-fieldset__heading",
        govukLabelGovUkLabel1: "label.govuk-label.govuk-label--l",
        fullPlanningApplicaitonType: "full-planning",
        houseHolderApplicaitonType: "householder",
        casPlanningApplicationType: "cas-planning",
        advertApplicationType: "adverts",
        listedBuildingApplicaitonType: "listed-building",
        appellantOther: "other",
        uploadApplicationForm: "upload-application-form",
        statusOfOriginalApplicationWritten: "written",
        statusOfOriginalApplicationRefused: "refused",
        statusOfOriginalApplicationNoDecision: "no decision",
        answerFullAppeal: "answer-full-appeal",
        answerHouseholderPlanning: "answer-householder-planning",
        answerListedBuilding: "answer-listed-building",
        answerMinorCommercialDevelopment: "answer-minor-commercial-development",
        answerMinorCommercialAdvertisement: "answer-minor-commercial-advertisment",
        fullAppealText: "Full appeal",
        householderPlanningText: "Householder planning",
        casPlanningText: "Minor commercial development",
        advertText: "Advertisement",

        advertisementAppealCaption: "Advertisement appeal",
        commercialAdvertisementAppealCaption: "Commercial advertisement appeal",
        listedBuildingText: "Listed building consent",
        systemTest2BoroughCouncil: "System Test Borough Council 2"
    }
    _fullAppealselectors = {
        decisionDateDay: '#decision-date-day',
        decisionDateMonth: '#decision-date-month',
        decisionDateYear: '#decision-date-year',
    }
    _houseHolderSelectors = {
        decisionDateHouseholderDay: '#decision-date-householder-day',
        decisionDateHouseholderMonth: '#decision-date-householder-month',
        decisionDateHouseholderYear: '#decision-date-householder-year',
    }
    _listedBuildingSelectors = {
        decisionDateDay: '#decision-date-day',
        decisionDateMonth: '#decision-date-month',
        decisionDateYear: '#decision-date-year',
    }
    _casPlanningSelectors = {
        decisionDateDay: '#decision-date-day',
        decisionDateMonth: '#decision-date-month',
        decisionDateYear: '#decision-date-year',
    }

    _advertSelectors = {
        decisionDateDay: '#decision-date-day',
        decisionDateMonth: '#decision-date-month',
        decisionDateYear: '#decision-date-year',
        onApplicationDateDay: '#onApplicationDate_day',
        onApplicationDateMonth: '#onApplicationDate_month',
        onApplicationDateYear: '#onApplicationDate_year',
    }
    _houseHolderURLs = {
        beforeYouStart: '/before-you-start',     
        appealHouseholderDecison: '/appeal-householder-decision',
        appealsHouseholderAppealForm: '/appeals/householder/appeal-form',
        appealsHouseholderPrepareAppeal: '/appeals/householder/prepare-appeal',
        appealsHouseholderUploadDocuments: '/appeals/householder/upload-documents'
    }
    _casPlanningURLs = {
        beforeYouStart: '/before-you-start',
        casplanning: '/cas-planning',
        appealsCasplanningAppealForm: '/appeals/cas-planning/appeal-form',
        appealsCasplanningPrepareAppeal: '/appeals/cas-planning/prepare-appeal',
        appealsCasplanningUploadDocuments: '/appeals/cas-planning/upload-documents'
    }
    _advertURLs = {
        beforeYouStart: '/before-you-start',
        advert: '/adverts',
        appealsAdvertAppealForm: '/appeals/adverts/appeal-form',
        appealsAdvertPrepareAppeal: '/appeals/adverts/prepare-appeal',
        appealsAdvertUploadDocuments: '/appeals/adverts/upload-documents'
    }
    _fullAppealURLs = {
        beforeYouStart: '/before-you-start',
        fullAppealSubmit: '/full-appeal/submit-appeal',
        appealsFullPlanningAppealForm: '/appeals/full-planning/appeal-form',
        appealsFullPlanningPrepareAppeal: '/appeals/full-planning/prepare-appeal',
        appealsFullPlanningUploadDocuments: '/appeals/full-planning/upload-documents'
    }
    _listedBuildingURLs = {
        beforeYouStart: '/before-you-start',
        listedBuildingSubmit: '/listed-building',
        appealslistedBuildingAppealForm: '/appeals/listed-building/appeal-form',
        appealslistedBuildingPrepareAppeal: '/appeals/listed-building/prepare-appeal',
        appealslistedBuildingUploadDocuments: '/appeals/listed-building/upload-documents'
    }
}