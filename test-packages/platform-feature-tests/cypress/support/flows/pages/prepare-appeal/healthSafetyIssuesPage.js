import { HealthSafetyIssues } from "../../../../page-objects/prepare-appeal/health-safety-issues";
module.exports = () => {
    const healthSafetyIssues = new HealthSafetyIssues();
    healthSafetyIssues.clickhealthSafetyIssues('#appellantSiteSafety-2');        
    cy.advanceToNextPage();           
};