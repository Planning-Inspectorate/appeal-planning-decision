export const sectionName = () => cy.get('.govuk-caption-l');
export const saveAndContinueButton = () => cy.get('[data-cy="save"]');
export const getSaveAndContinueButton = () => cy.get('[data-cy="button-save-and-continue"]');
export const backButton = () => cy.get('[data-cy="back"]');
export const pageHeading = () => cy.get('h1');
export const textArea = (textAreaId) => cy.get(`textarea[data-cy="${textAreaId}"]`);
export const textBox = (textBoxId) => cy.get(`[data-cy="${textBoxId}"]`);
export const labelText = (labelTextId) => cy.get(`[data-cy="${labelTextId}"]`);
export const label = (labelId) => cy.get(`label[data-cy="${labelId}"]`);
export const labelLegend = (labelLegendId) => cy.get(`[data-cy="${labelLegendId}"] legend`);
export const labelHint = (labelHintId) => cy.get(`div[data-cy="${labelHintId}"]`);
export const input = (inputId) => cy.get(`input[data-cy="${inputId}"]`);
export const errorMessage = (errorMessageId) => cy.get(`[data-cy="${errorMessageId}"]`);
export const summaryErrorMessage = (summaryErrorMessageId) =>
	cy.get(`a[href="#${summaryErrorMessageId}"]`);
export const summaryFileUploadErrorMessage = () => cy.get(`a[href="#documents"]`);
export const findoutAboutCallCharges = () =>
	cy.findAllByRole('link', { name: 'Find out about call charges (opens in new tab)' });
export const enquiriesEmailLink = () =>
	cy.findAllByRole('link', { name: 'enquiries@planninginspectorate.gov.uk' });