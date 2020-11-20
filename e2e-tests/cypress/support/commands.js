Cypress.Commands.add("provideDecisionDate", require('./eligibility-decision-date/provideDecisionDate'));
Cypress.Commands.add("confirmProvidedDecisionDateWasAccepted", require('./eligibility-decision-date/confirmProvidedDecisionDateWasAccepted'));
Cypress.Commands.add("confirmProvidedDecisionDateWasRejected", require('./eligibility-decision-date/confirmProvidedDecisionDateWasRejected'));
Cypress.Commands.add("confirmProvidedDecisionDateWasInvalid", require('./eligibility-decision-date/confirmProvidedDecisionDateWasInvalid'));
