import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';

let disableJs = false;

const visibleWithText = (textToFind, lookup) => {
  cy.get(lookup)
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(textToFind);
    });
};

const visibleWithoutText = (textToFind, lookup) => {
  cy.get(lookup)
    .invoke('text')
    .then((text) => {
      expect(text).not.to.contain(textToFind);
    });
};

const clickUploadButton = () => {
  cy.get('[data-cy="upload-file"]').click();
};

const deleteFile = () => {
  cy.get(`.moj-multi-file-upload__delete`).click();
};

const validateFileUpload = (fileName) => {
  visibleWithText(fileName, '.govuk-summary-list__row');
};

const validateFileNotPresent = (fileName) => {
  visibleWithoutText(fileName, '.moj-multi-file-upload__list');
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

const verifyUploadPageTitle = () => {
  cy.get('@page').then(({ title }) => {
    cy.verifyPageTitle(`Error: ${title}`);
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
  deleteFile('upload-file-valid.pdf');
});

Then('progress is halted with a message to {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage, '#documents-error', 'documents');
  verifyUploadPageTitle();
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

  cy.validateErrorMessage(errorMessage, null, fileName);
  validateFileUpload(errorMessage);
  verifyUploadPageTitle();
});

Then('any document uploaded will not be saved', () => {
  goToUploadPage();
  validateFileNotPresent('upload-file-valid.pdf');
});

Then('the file is removed', () => {
  validateFileNotPresent('upload-file-valid.pdf');
});

Then('the information they previously entered is still populated', () => {
  validateFileUpload('upload-file-valid.pdf');
});
