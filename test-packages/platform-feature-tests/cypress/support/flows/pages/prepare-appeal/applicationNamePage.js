import { ApplicationName } from "../../../../page-objects/prepare-appeal/application-name";
module.exports = (isAppellant) => {
    const applicationName = new ApplicationName();

    if (isAppellant) {
        applicationName.clickApplicationName('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
    }
    else {
        applicationName.clickApplicationName('[data-cy="answer-no"]');
        cy.advanceToNextPage();
        applicationName.addApplicationNameField('#appellantFirstName', 'firstname');
        applicationName.addApplicationNameField('#appellantLastName', 'lastname');
        applicationName.addApplicationNameField('#appellantCompanyName', 'companyname')
        cy.advanceToNextPage();

    }

};
