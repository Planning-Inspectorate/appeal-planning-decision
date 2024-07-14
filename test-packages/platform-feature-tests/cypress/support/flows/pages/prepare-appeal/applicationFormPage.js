import { ApplicationForm } from "../../../../page-objects/prepare-appeal/application-form";
module.exports = (applicationType, appellant, dynamicId) => {
    const applicationForm = new ApplicationForm();
    cy.taskListComponent(applicationType, 'application-name', dynamicId);
};
