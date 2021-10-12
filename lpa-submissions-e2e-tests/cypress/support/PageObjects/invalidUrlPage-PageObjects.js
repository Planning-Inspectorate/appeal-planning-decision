export const getContactUsLink = () => {
  return cy.findByRole('link',{name:'Contact the Planning Inspectorate Customer Support'});
}

export const getFindAboutCallChargesLink = () => cy.get('a[href="https://www.gov.uk/call-charges"]');
export const getEmailLink = () => cy.get('a[href="mailto:enquiries@planninginspectorate.gov.uk"]');
