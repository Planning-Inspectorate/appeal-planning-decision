export const selectYes = () => cy.get('[data-cy="answer-yes"]');
export const selectNo = () => cy.get('[data-cy="answer-no"]');
export const selectSomeOf = () => cy.get('[data-cy="answer-some"]');
export const errorMessageOwnAllLand = () => cy.get('#own-all-the-land-error');
export const errorMessageOwnSomeLand = () => cy.get('#own-some-of-the-land-error');
export const errorMessageKnowTheOwners = () => cy.get('#know-the-owners-error');
export const errorMessageAgriculturalHolding = () => cy.get('#agricultural-holding-error');
export const hintTextAgriculturalHolding = () => cy.get('#agricultural-holding-hint');
export const errorMessageAreYouATenant = () => cy.get('#are-you-a-tenant-error');
export const errorMessageOtherTenants = () => cy.get('#other-tenants-error');
export const textBox = () => cy.get('#visible-from-road-details');
export const checkBoxIdentifyingTheOwners = () => cy.get('[data-cy=identifying-the-owners]');
export const errorMessageIdentifyingTheOwners = () => cy.get('#identifying-the-owners-error');
export const checkBoxLabelIdentifyingTheOwners = () => cy.get('.govuk-label');
export const statementTitle = () => cy.get('.govuk-heading-m');
export const listItem1IdentifyingTheOwners = () => cy.findAllByText('searching the land registry');
export const listItem2IdentifyingTheOwners = () =>
	cy.findAllByText('putting up a site notice at the appeal site');
export const tellingTheLandOwnersToldAboutAppeal = () =>
	cy.get('[data-cy=telling-the-landowners-toldAboutMyAppeal]');
export const tellingTheLandOwnersWithinLast21Days = () =>
	cy.get('[data-cy=telling-the-landowners-withinLast21Days]');
export const tellingTheLandOwnersUseCopyOfTheForm = () =>
	cy.get('[data-cy=telling-the-landowners-useCopyOfTheForm]');
export const tellingTheLandownersText = () =>
	cy.findByText('You must have told all the landowners about your appeal.');
export const tellingTheLandownersFormInAnnex = () =>
	cy.findByRole('link', { name: "form in annexe 2A or 2B of the 'making your appeal' guidance" });
export const errorMessageTellingTheLandowners = () => cy.get('#telling-the-landowners-error');
export const tellingTheOtherLandownersText = () =>
	cy.findByText('You must have told all the other landowners about your appeal.');
export const identifyingTheOtherOwnersText = () =>
	cy.findByText('You must have attempted to identify all the other landowners.');
export const tellingTheTenantsToldAboutAppeal = () =>
	cy.get('[data-cy=telling-the-tenants-toldAboutMyAppeal]');
export const tellingTheTenantsWithinLast21Days = () =>
	cy.get('[data-cy=telling-the-tenants-withinLast21Days]');
export const tellingTheTenantsCopyOfTheForm = () =>
	cy.get('[data-cy=telling-the-tenants-useCopyOfTheForm]');
export const tellingTheTenantsText = () =>
	cy.findByText('You must have told all the tenants about your appeal.');
export const tellingTheTenantsFormInAnnexe = () =>
	cy.findByRole('link', { name: "form in Annexe 2a of the 'making your appeal' guidance" });
export const errorMessageTellingTheTenants = () => cy.get('#telling-the-tenants-error');
export const tellingTheOtherTenantsText = () =>
	cy.findByText('You must have told all the other tenants about your appeal.');
export const advertisingYourAppealToldAboutAppeal = () =>
	cy.get('[data-cy=advertising-your-appeal-toldAboutMyAppeal]');
export const advertisingYourAppealWithinLast21Days = () =>
	cy.get('[data-cy=advertising-your-appeal-withinLast21Days]');
export const advertisingYourAppealUseCopyOfTheForm = () =>
	cy.get('[data-cy=advertising-your-appeal-useCopyOfTheForm]');
export const advertisingYourAppealForKnowSomeOfTheLandownersText = () =>
	cy.findByText(
		'Because you do not know all the landowners, you must have advertised your appeal in the press.'
	);
export const advertisingYourAppealFormInAnnex = () =>
	cy.findByRole('link', { name: "form in annexe 2A or 2B of the 'making your appeal' guidance" });
export const advertisingYourAppealForKnowSomeOfTheOtherLandownersText = () =>
	cy.findByText(
		'Because you do not know all the other landowners, you must have advertised your appeal in the press.'
	);
export const errorMessageAdvertisingYourAppeal = () => cy.get('#advertising-your-appeal-error');
export const advertisingYourAppealForKnowNoneOfTheLandownersText = () =>
	cy.findByText(
		'Because you do not know the landowners, you must have advertised your appeal in the press.'
	);
export const advertisingYourAppealForKnowNoneOfTheOtherLandownersText = () =>
	cy.findByText(
		'Because you do not know the other landowners, you must have advertised your appeal in the press.'
	);
