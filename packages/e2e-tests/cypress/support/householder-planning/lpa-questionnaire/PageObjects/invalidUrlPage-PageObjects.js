export const getContactUsLink = () => {
  return cy.findByRole('link',{name:'Contact the Planning Inspectorate Customer Support'});
}

export const getFindAboutCallChargesLink = () => cy.findAllByRole('link',{name:'Find out about call charges'});
export const getEmailLink = () => cy.findAllByRole('link',{name:'enquiries@planninginspectorate.gov.uk'});
