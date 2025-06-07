// @ts-nocheck
function deleteUploadedDocuments() {
    cy.get('body').then($body => {
        if ($body.find('button.moj-multi-file-upload__delete').length > 0) {
            cy.get('button.moj-multi-file-upload__delete').first().click();
            // Wait for DOM update, then recursively call until all are gone
            deleteUploadedDocuments();
        }
    });
}
export { deleteUploadedDocuments };