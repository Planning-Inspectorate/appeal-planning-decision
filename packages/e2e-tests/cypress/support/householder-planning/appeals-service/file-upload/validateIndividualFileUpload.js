export const validateIndividualFileUpload = (selector) => {
  cy.get(selector)
    .invoke('attr', 'data-file-size')
    .then((dataFileSize) => {
      const fileSize = parseInt(dataFileSize, 10);
      expect(fileSize).to.greaterThan(0);
    });
};
