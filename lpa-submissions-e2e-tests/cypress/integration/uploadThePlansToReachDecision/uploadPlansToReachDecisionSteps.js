import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';
const documentServiceBaseURL = Cypress.env('DOCUMENT_SERVICE_BASE_URL');

const pageTitle =
  'Upload plans used to reach the decision - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const pageUrl = '/plans';
const path = `plans`;

let disableJs = false;

const preCannedAppeal = require('../../fixtures/anAppeal.json');

const goToUploadDecisionPage = () => {
  cy.get('@appeal').then( (appeal) =>{
    cy.visit(`${appeal.id}/${path}`, { script: !disableJs });
  });
};

const clickUploadButton = () => {
  cy.get('[data-cy="upload-file"]').click();
};

const uploadFiles = (fileName, dropZone) => {
  // start watching the POST requests
  cy.server({ method: 'POST' });
  cy.route({
    method: 'POST',
    url: disableJs ? /plans/ : /upload/,
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
};

const deleteFile = () => {
  cy.get(`.moj-multi-file-upload__delete`).click();
};

const validateFileUpload = (fileName) => {
  cy.visibleWithText(fileName, '.govuk-summary-list__row');
};

const validateFileDeleted = (fileName) => {
  cy.visibleWithoutText(fileName, '.moj-multi-file-upload__list');
};

const documentsFor = (appealReplyId) => {
  return cy.request({
    url: `${documentServiceBaseURL}/${appealReplyId}`,
    failOnStatusCode: false,
  }).then(resp=>resp.body)
}

const scanDocumentsForOurFile = (documents, fileName) => {
  return documents && documents.length && documents.find(document=>document.name===fileName);
}

const fileIsInDocumentService = (appealReplyId, fileName) => {
  documentsFor(appealReplyId).then((documents) => {
    const ourFileInDocumentService = scanDocumentsForOurFile(documents, fileName);
    expect(ourFileInDocumentService).to.not.eq(undefined, `expected to find ${fileName} in document store for ${appealReplyId}`);
  });
}

const fileIsNotInDocumentService = (appealReplyId, fileName) => {
  documentsFor(appealReplyId).then((documents) => {
    const ourFileInDocumentService = scanDocumentsForOurFile(documents, fileName);
    expect(ourFileInDocumentService).to.eq(undefined, `expected ${fileName} to have been deleted from document store for ${appealReplyId}`);
  });
}

const expectFileToBeInDocumentService = (fileName) => {
  cy.getAppealReplyId().then( (id) => {
    fileIsInDocumentService(id, fileName)
  });
}

const expectFileNotToBeInDocumentService = (fileName) => {
  cy.getAppealReplyId().then( (id) => {
    fileIsNotInDocumentService(id, fileName)
  });
}

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

Given('Upload the plans used to reach the decision question is requested', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
  });
});

Given('a file has been uploaded', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
    uploadFiles('upload-file-valid.pdf');
  });
});

Given('a file has been uploaded and confirmed', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
    uploadFiles('upload-file-valid.pdf');
    validateFileUpload('upload-file-valid.pdf');
    cy.clickSaveAndContinue();
  });
});

Given('a file has been uploaded and confirmed And Upload the plans used to reach the decision question is requested', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
    uploadFiles('upload-file-valid.pdf');
    validateFileUpload('upload-file-valid.pdf');
    cy.clickSaveAndContinue();
    goToUploadDecisionPage(appealReply.appealId);
  });
});

Given("The question 'Upload the plans used to reach the decision' has been completed", () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    goToUploadDecisionPage(appealReply.appealId);
    uploadFiles('upload-file-valid.pdf');
    validateFileUpload('upload-file-valid.pdf');
    cy.clickSaveAndContinue();
  });
});

When('LPA Planning Officer chooses to upload plans used to reach the decision', () => {
  cy.clickOnSubTaskLink('plansDecision');
  cy.verifyPage(pageUrl);
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

When('Back is then requested', () => {
  cy.clickBackButton();
});

When('LPA Planning Officer deletes the file', () => {
  deleteFile('upload-file-valid.pdf');
});

When('the plans used to reach the decision question is requested', () => {
  goToUploadDecisionPage();
});

When('an answer is saved', () => {
  const fileName = 'upload-file-valid.docx';
  uploadFiles(fileName);
  validateFileUpload(fileName);
  cy.clickSaveAndContinue();
});

Then('LPA Planning Officer is presented with the ability to upload plans', () => {
  cy.verifyPage(pageUrl);
  cy.verifyPageTitle(pageTitle);
  cy.verifyPageHeading('Upload the plans used to reach the decision');
  cy.verifySectionName('Required documents');
  cy.checkPageA11y(path);
});

Then('Upload the plans used to reach the decision subsection is shown as completed', () => {
  cy.verifyCompletedStatus('plansDecision');
});

Then('progress is halted with question error message {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage, '#documents-error', 'documents');
  cy.verifyPageTitle(`Error: ${pageTitle}`);
});

Then('progress is halted with file {string} error message {string}', (fileName, errorMessage) => {
  cy.validateErrorMessage(errorMessage, null, fileName);
  validateFileUpload(errorMessage);
  cy.verifyPageTitle(`Error: ${pageTitle}`);
});

Then('the file is removed', () => {
  validateFileDeleted('upload-file-valid.pdf');
  expectFileNotToBeInDocumentService('upload-file-valid.pdf');
});

Then('the information they previously entered is still populated', () => {
  validateFileUpload('upload-file-valid.pdf');
  expectFileToBeInDocumentService('upload-file-valid.pdf');
});

Then('the updated answer is displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('plansDecision', 'upload-file-valid.docx');
});
