const severityIndicators = {
    minor:'🟢 Minor',
    moderate:'🟡 Moderate',
    serious:'🟠 Serious',
    critical:'🔴 Critical'
}

function callback(violations){
    violations.forEach(violation => {
        const nodes = Cypress.$(violation.nodes.map(node => node.target).join(','))

        Cypress.log({
            name:`${severityIndicators[violation.impact]} A11Y`,
            consoleProps:() =>violation,
            $el:nodes,
            message: `[${violation.help}](${violation.helpUrl})`
        })

        violation.nodes.forEach(({ target })=>{
            Cypress.log({
                name:'🔧 Fix',
                consoleProps: () => violation,
                $el: Cypress.$(target.join(',')),
                message:target
            })
        })
    });
}

Cypress.Commands.add("checkPageA11y", (path) =>{
    cy.visit(path);
    cy.injectAxe();
    cy.checkA11y(null,null,callback);
})

Cypress.Commands.add('goToTaskListQuestionnairePage',
require('./appeals-questionnaire-tasklist/goToAppealsQuestionnaireTasklistPage'));

Cypress.Commands.add('goToReviewAccuracyOfTheAppellantSubmissionPage',
require('./appeals-questionnaire-navigation/goToReviewAccuracyOfTheAppellantsSubmissionPage'));

Cypress.Commands.add('goToExtraConditionsPage',
require('./appeals-questionnaire-navigation/goToExtraConditionsPage'));

Cypress.Commands.add('goToTellUsAboutAppealsInImmediateAreaPage',
require('./appeals-questionnaire-navigation/goToTellUsAboutAppealsInImmediateAreaPage'));

Cypress.Commands.add('goToTellUsAboutAppealSitePage',
require('./appeals-questionnaire-navigation/goToTellUsAboutAppealSitePage'));

Cypress.Commands.add('goToDevelopmentPlanDocumentOrNeighbourhoodPlanPage',
require('./appeals-questionnaire-navigation/goToDevelopmentPlanDocumentOrNeighbourhoodPlanPage'));

Cypress.Commands.add('goToNotifyingInterestedPartiesOfTheAppealPage',
require('./appeals-questionnaire-navigation/goToNotifyingInterestedPartiesOfTheAppealPage'));

Cypress.Commands.add('goToOtherRelevantPoliciesPage',
require('./appeals-questionnaire-navigation/goToOtherRelevantPoliciesPage'));

Cypress.Commands.add('goToPlanningHistoryPage',
require('./appeals-questionnaire-navigation/goToPlanningHistoryPage'));

Cypress.Commands.add('goToRepresentationsFromInterestedPartiesPage',
require('./appeals-questionnaire-navigation/goToRepresentationsFromInterestedPartiesPage'));

Cypress.Commands.add('goToSiteNoticesPage',
require('./appeals-questionnaire-navigation/goToSiteNoticesPage'));

Cypress.Commands.add('goToStatutoryDevelopmentPlanPolicyPage',
require('./appeals-questionnaire-navigation/goToStatutoryDevelopmentPlanPolicyPage'));

Cypress.Commands.add('goToSupplementaryPlanningDocumentsExtractPage',
require('./appeals-questionnaire-navigation/goToSupplementaryPlanningDocumentsExtractPage'));

Cypress.Commands.add('goToTellingInterestedPartiesAboutTheApplicationPage',
require('./appeals-questionnaire-navigation/goToTellingInterestedPartiesAboutTheApplicationPage'));

Cypress.Commands.add('goToUploadPlanningOfficersReportPage',
require('./appeals-questionnaire-navigation/goToUploadPlanningOfficersReportPage'));

Cypress.Commands.add('goToUploadThePlansUsedToReachDecisionPage',
require('./appeals-questionnaire-navigation/goToUploadThePlansUsedToReachDecisionPage'));

Cypress.Commands.add('verifyNotStartedStatus',
require('./appeals-questionnaire-navigation/verifyNotStartedStatus'));
