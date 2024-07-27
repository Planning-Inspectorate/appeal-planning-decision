export class PrepareAppealSelector {

    _selectors = {
        emailCode: '#email-code',
        applicationReference: '#applicationReference',
        appliationNumber: '[data-cy="application-number"]',
        emailAddress: '[data-cy="email-address"]',
        onApplicationDateDay: '#onApplicationDate_day',
        onApplicationDateMonth: '#onApplicationDate_month',
        onApplicationDateYear: '#onApplicationDate_year',
        developmentDescriptionOriginal: '#developmentDescriptionOriginal',
    }
    _fullAppealselectors = {
        decisionDateDay: '#decision-date-day',
        decisionDateMonth: '#decision-date-month',
        decisionDateYear: '#decision-date-year',
    };
    _houseHolderSelectors = {
        decisionDateHouseholderDay: '#decision-date-householder-day',
        decisionDateHouseholderMonth: '#decision-date-householder-month',
        decisionDateHouseholderYear: '#decision-date-householder-year',
    }
}
