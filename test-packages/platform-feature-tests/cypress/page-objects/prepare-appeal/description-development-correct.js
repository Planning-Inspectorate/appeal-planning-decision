export class DescriptionDevelopmentCorrect {
	descriptionDevelopmentCorrectElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickDescriptionDevelopmentCorrect(updateDevelopmentDescription) {
        this.descriptionDevelopmentCorrectElements.clickRadioBtn(updateDevelopmentDescription).click();
    }
}
