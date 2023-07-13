/*
const { ErrorSummary } = require('../js/helpers/index');

const sensitiveInformationError = "Select to confirm you have not included sensitive information";
const appealNotSelectedError = "Select your appeal statement";

  const isFileUploadErrorSet = (errorMessage) => {
    const fileUpload = document.getElementById('file-upload');
    const parentDiv = fileUpload.parentNode;
    return [...parentDiv
      .querySelectorAll("span")]
      .filter(span => span.textContent.includes(errorMessage))
      .length > 0;
  };

  const setFileUploadError = (errorMessage) => {
    if(isFileUploadErrorSet(errorMessage)) return;
    const fileUpload = document.getElementById('file-upload');
    const parentDiv = fileUpload.parentNode;
    const formGroup = parentDiv.closest("div.govuk-form-group");
    formGroup.classList = formGroup.classList.toString().trim() + '--error';
    if(isFileUploadErrorSet(errorMessage)) return;
    const errorSpan = document.createElement("span");
    const errorMessageSpan = document.createElement("span")
    const p = document.createElement("p");
    p.classList = "govuk-error-message";
    errorMessageSpan.classList = "govuk-visually-hidden";
    errorMessageSpan.textContent = "Error:";
    errorSpan.textContent = errorMessage;
    errorSpan.classList = "govuk-error-message";
    errorSpan.appendChild(errorMessageSpan);
    p.appendChild(errorSpan);
    parentDiv.insertBefore(p, fileUpload);
  }

  // eslint-disable-next-line no-unused-vars
  const unsetFileUploadError = (e) => {
    if(e.target.value === "") return;
    if(!isFileUploadErrorSet(appealNotSelectedError)) return;
    if(shouldHideErrorSummary()) ErrorSummary.hideErrorSummaryBlock();
    const fileUpload = document.getElementById('file-upload');
    const parentDiv = fileUpload.parentNode;
    parentDiv.classList = parentDiv.classList.toString().replace('--error', '');
    const errorBlock = parentDiv.querySelectorAll("p.govuk-error-message")[0];
    errorBlock && parentDiv.removeChild(errorBlock);
  }

  const isCheckboxErrorSet = (errorMessage) => {
    const checkboxFormGroup = document.getElementById("does-not-include-sensitive-information");
    if(!checkboxFormGroup.querySelectorAll("p.govuk-error-message").length > 0) return;
    return [...checkboxFormGroup
      .querySelectorAll("p.govuk-error-message > span")]
      .filter(span => span.textContent.includes(errorMessage))
      .length > 0;
  }

  // eslint-disable-next-line no-unused-vars
  const unsetCheckboxError = (e) => {
    if(!e.target.checked) return;
    if(shouldHideErrorSummary()) ErrorSummary.hideErrorSummaryBlock();
    const checkboxFormGroup = document.getElementById("does-not-include-sensitive-information");
    checkboxFormGroup.classList = checkboxFormGroup.classList.toString().replace('--error','');
    const fieldSet = checkboxFormGroup.getElementsByTagName("fieldset")[0];
    const p = fieldSet.querySelectorAll("p.govuk-error-message")[0];
    p && fieldSet.removeChild(p);
  }

  const setCheckboxError = (errorMessage) => {
    if(isCheckboxErrorSet(errorMessage)) return;
    const checkboxFormGroup = document.getElementById("does-not-include-sensitive-information");
    checkboxFormGroup.classList += '--error';
    const fieldSet = checkboxFormGroup.getElementsByTagName("fieldset")[0];
    const div = fieldSet.getElementsByTagName("div")[0];
    const p = document.createElement("p");
    p.classList = "govuk-error-message";
    const errorSpan = document.createElement("span");
    const errorMessageSpan = document.createElement("span")
    errorMessageSpan.classList = "govuk-visually-hidden";
    errorMessageSpan.textContent = "Error:";
    errorSpan.textContent = errorMessage;
    errorSpan.classList = "govuk-error-message";
    errorSpan.appendChild(errorMessageSpan);
    p.appendChild(errorSpan);
    fieldSet.insertBefore(p, div);
  }

  const isAppealStatementSelected = () => document.getElementById('file-upload') ? document.getElementById('file-upload').value != "" : false;
  const isDNISensitiveInformationChecked = () => document.getElementById('i-confirm') ? document.getElementById('i-confirm').checked : false;
  const shouldHideErrorSummary = () => isAppealStatementSelected() && isDNISensitiveInformationChecked(); 

  const submitForm = () => document.getElementsByTagName("form")[0].submit();

  // eslint-disable-next-line no-unused-vars
  const saveAndContinueClick = () => {

    const sensitiveInformationChecked = isDNISensitiveInformationChecked();
    const appealStatementSelected = isAppealStatementSelected();
    let returnVal = true;
         
    ErrorSummary.hideErrorSummaryBlock();
    
    if(!sensitiveInformationChecked) {
      ErrorSummary.setError(sensitiveInformationError);
      setCheckboxError(sensitiveInformationError);
      ErrorSummary.showErrorSummaryBlock();
      returnVal = false;
    } 
    if(!appealStatementSelected) {
      ErrorSummary.setError(appealNotSelectedError);
      setFileUploadError(appealNotSelectedError);
      ErrorSummary.showErrorSummaryBlock();
      returnVal = false;
    } 

    if(returnVal) submitForm();

    return returnVal;

  }
  */
