import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';

const documentServiceBaseURL = Cypress.env('DOCUMENT_SERVICE_BASE_URL');
const assumeLimitedAccess = Cypress.env('ASSUME_LIMITED_ACCESS');

let disableJs = false;

const clickUploadButton = () => {
  cy.get('[data-cy="upload-file"]').click();
};

const deleteFile = () => {
  cy.get(`.moj-multi-file-upload__delete`).click();
};

const validateFileUpload = (fileName) => {
  cy.visibleWithText(fileName, '.govuk-summary-list__row');
};

const validateFileNotPresent = (fileName) => {
  cy.visibleWithoutText(fileName, '.moj-multi-file-upload__list');
};

const uploadFiles = (fileName, dropZone) => {
  cy.get('@page').then(({ url }) => {
    // start watching the POST requests
    cy.server({ method: 'POST' });
    cy.route({
      method: 'POST',
      url: disableJs ? url : 'upload',
    }).as('upload');

    const target = () => {
      return dropZone ? cy.get('.moj-multi-file-upload__dropzone') : cy.get('input#documents');
    };

    target().attachFile(
      Array.isArray(fileName) ? fileName : [fileName],
      dropZone ? { subjectType: 'drag-n-drop' } : null,
    );

    if (disableJs) {
      clickUploadButton();
    } else {
      cy.wait('@upload', { requestTimeout: 3000 });
    }
    cy.server({ enable: false });
  });
};

const goToUploadPage = () => {
  cy.get('@page').then(({ url }) => {
    cy.goToPage(url, undefined, disableJs);
  });
};

const verifyUploadPageTitleError = () => {
  cy.get('@page').then(({ title }) => {
    cy.verifyPageTitle(`Error: ${title}`);
  });
};

const documentsFor = (appealReplyId) => {
  return cy
    .request({
      url: `${documentServiceBaseURL}/${appealReplyId}`,
      failOnStatusCode: false,
    })
    .then((resp) => resp.body);
};

const scanDocumentsForOurFile = (documents, fileName) => {
  return documents && documents.length && documents.find((document) => document.metadata.name === fileName);
};

const fileIsInDocumentService = (appealReplyId, fileName) => {
  documentsFor(appealReplyId).then((documents) => {
    const ourFileInDocumentService = scanDocumentsForOurFile(documents, fileName);
    expect(ourFileInDocumentService).to.not.eq(
      undefined,
      `expected to find ${fileName} in document store for ${appealReplyId}`,
    );
  });
};

const fileIsNotInDocumentService = (appealReplyId, fileName) => {
  documentsFor(appealReplyId).then((documents) => {
    const ourFileInDocumentService = scanDocumentsForOurFile(documents, fileName);
    expect(ourFileInDocumentService).to.eq(
      undefined,
      `expected ${fileName} to have been deleted from document store for ${appealReplyId}`,
    );
  });
};

const expectFileToBeInDocumentService = (fileName) => {
  cy.getAppealReplyId().then((id) => {
    fileIsInDocumentService(id, fileName);
  });
};

const expectFileNotToBeInDocumentService = (fileName) => {
  cy.getAppealReplyId().then((id) => {
    fileIsNotInDocumentService(id, fileName);
  });
};

/**
 * Steps
 * ----------------------------------------------
 */

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

After({ tags: '@nojs' }, () => {
  disableJs = false;
});

Given('a file has been uploaded', () => {
  goToUploadPage();
  uploadFiles('upload-file-valid.pdf');
});

Given('a file has been uploaded and confirmed', () => {
  goToUploadPage();
  uploadFiles('upload-file-valid.pdf');
  validateFileUpload('upload-file-valid.pdf');
  cy.clickSaveAndContinue();
  goToUploadPage();
});

Given('The question {string} has been completed', () => {
  goToUploadPage();
  uploadFiles('upload-file-valid.pdf');
  validateFileUpload('upload-file-valid.pdf');
  cy.clickSaveAndContinue();
});

When('valid file {string} is successfully uploaded', (fileName) => {
  uploadFiles(fileName);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('valid file {string} is uploaded via drag and drop', (fileName) => {
  uploadFiles(fileName, true);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('valid multiple files {string} are uploaded', (fileNames) => {
  uploadFiles(fileNames.split(', '));
  cy.clickSaveAndContinue();
});

When('no file has been uploaded', () => {
  cy.clickSaveAndContinue();
});

When('invalid files {string} have been selected', (fileName) => {
  uploadFiles(fileName);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

When('LPA Planning Officer deletes the file', () => {
  deleteFile();
});

When('an answer is saved', () => {
  const fileName = 'upload-file-valid.docx';
  uploadFiles(fileName);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

Then('progress is halted with a message to {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage, '#documents-error', 'documents');
  verifyUploadPageTitleError();
});

Then('progress is halted with a message the file {string} {string}', (fileName, errorType) => {
  let errorMessage = fileName;

  switch (errorType) {
    case 'is too big':
      errorMessage += ' must be smaller than 15 MB';
      break;
    case 'format is incorrect':
      errorMessage += ' is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG';
      break;
  }

  cy.validateFileUploadErrorMessage(errorMessage, null);
});

Then('any document uploaded will not be saved', () => {
  goToUploadPage();
  validateFileNotPresent('upload-file-valid.pdf');
});

Then('the file is removed', () => {
  cy.wait(1000);
  validateFileNotPresent('upload-file-valid.pdf');
  if (!assumeLimitedAccess) {
    expectFileNotToBeInDocumentService('upload-file-valid.pdf');
  }
});

Then('the information they previously entered is still populated', () => {
  validateFileUpload('upload-file-valid.pdf');
  if (!assumeLimitedAccess) {
    expectFileToBeInDocumentService('upload-file-valid.pdf');
  }
});

Then('the updated answer is displayed', () => {
  cy.get('@page').then(({ id }) => {
    cy.confirmCheckYourAnswersDisplayed(id, 'upload-file-valid.docx');
  });
});

Then('the status is not started', () => {
  cy.get('@page').then(({ id }) => {
    cy.get(`li[${id}-status="NOT STARTED"]`).find('.govuk-tag').contains('NOT STARTED');
  });
});
