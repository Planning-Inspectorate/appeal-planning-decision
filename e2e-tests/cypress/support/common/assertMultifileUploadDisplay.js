const getExpectedHeadingText = (expectedFileNames) => {
  switch (expectedFileNames.length) {
    case 0: {
      return 'No files uploaded';
    }
    case 1: {
      return '1 file uploaded';
    }
    default: {
      return `${expectedFileNames.length} files uploaded`;
    }
  }
};

module.exports = (cyTag, expectedFileNames) => {
  if (!Array.isArray(expectedFileNames)) {
    throw new Error('expectedFileNames must be an array.');
  }

  if (expectedFileNames.length === 0) {
    cy.get(`[data-cy='${cyTag}-no-files']`)
      .invoke('text')
      .then((text) => text.trim())
      .should('eq', getExpectedHeadingText(expectedFileNames));

    return;
  }

  cy.get(`[data-cy='${cyTag}-uploaded-file-count-heading']`)
    .invoke('text')
    .then((text) => text.trim())
    .should('eq', getExpectedHeadingText(expectedFileNames));

  expectedFileNames.forEach((expectedFileName, index) => {
    cy.get(`[data-cy='${cyTag}-uploaded-file-${index}']`)
      .invoke('text')
      .then((text) => text.trim())
      .should('eq', expectedFileName);
  });
};
