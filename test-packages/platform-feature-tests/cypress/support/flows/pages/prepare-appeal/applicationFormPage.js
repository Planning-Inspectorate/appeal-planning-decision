module.exports = (applicationType, appellant, dynamicId) => {

    cy.taskListComponent(applicationType, 'application-name', dynamicId);
};
