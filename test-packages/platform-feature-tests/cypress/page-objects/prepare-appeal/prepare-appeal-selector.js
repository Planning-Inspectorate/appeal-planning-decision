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
    _houseHolderURLs = {
        beforeYouStart: '/before-you-start',
        appealHouseholderDecison: '/appeal-householder-decision',
        appealsHouseholderAppealForm: '/appeals/householder/appeal-form',
        appealsHouseholderPrepareAppeal: '/appeals/householder/prepare-appeal',
        appealsHouseholderUploadDocuments: '/appeals/householder/upload-documents'
    }
}
