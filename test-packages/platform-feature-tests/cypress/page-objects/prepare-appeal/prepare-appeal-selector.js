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
        listedBuildingApplicaitonType: "listed-building",
        appellantOther: "other",
        uploadApplicationForm: "upload-application-form",
        statusOfOriginalApplicationWritten: "written",
        statusOfOriginalApplicationRefused: "refused",
        statusOfOriginalApplicationNoDecision: "no decision",
        answerFullAppeal: "answer-full-appeal",
        answerHouseholderPlanning: "answer-householder-planning",
        answerListedBuilding: "answer-listed-building",
        fullAppealText: "Full appeal",
        householderPlanningText: "Householder planning",
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
    _houseHolderURLs = {
        beforeYouStart: '/before-you-start',     
        appealHouseholderDecison: '/appeal-householder-decision',
        appealsHouseholderAppealForm: '/appeals/householder/appeal-form',
        appealsHouseholderPrepareAppeal: '/appeals/householder/prepare-appeal',
        appealsHouseholderUploadDocuments: '/appeals/householder/upload-documents'
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