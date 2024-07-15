export class HealthSafetyIssues {
	healthSafetyIssuesElements = {
        clickRadioBtn:(radioId) =>cy.get(radioId),
        healthSafetyIssuesField:(fieldType)=> cy.get(fieldType) };

    clickHealthSafetyIssues(appellantSiteSafety) {
        this.healthSafetyIssuesElements.clickRadioBtn(appellantSiteSafety).click();    
    }

    addHealthSafetyIssuesField(fieldType,fieldValue){
        this.healthSafetyIssuesElements.healthSafetyIssuesField(fieldType).type(fieldValue);
    }
 };