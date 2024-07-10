export class DecideAppeal {
	decideAppealElements = {		
	    clickRadioBtn:(radioId) =>cy.get(radioId)	};
	
    clickDecideAppeal(appellantProcedurePreference) {
        this.decideAppealElements.clickRadioBtn(appellantProcedurePreference).click();
    }
}
