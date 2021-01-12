const tmpPath = `${Cypress.config('fileServerFolder')}/../tmp/documents-upload`;

module.exports = (selector) => {
  let fileId;
  let fileSize;

  cy.get(selector)
    .invoke('attr', 'data-file-location')
    .then((dataFileLocation) => {
      fileId = dataFileLocation;

      cy.get(selector)
        .invoke('attr', 'data-file-size')
        .then((dataFileSize) => {
          fileSize = parseInt(dataFileSize, 10);

          const filePath = `${tmpPath}/${dataFileLocation}`;

          cy.readFile(filePath).then((data) => {
            expect(data.length).to.greaterThan(0);
            expect(data.length).to.lessThan(fileSize + (fileSize / 100) * 0.1);
          });
        });
    });
};
