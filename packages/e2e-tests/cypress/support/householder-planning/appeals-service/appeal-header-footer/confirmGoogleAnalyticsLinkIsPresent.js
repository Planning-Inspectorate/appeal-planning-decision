export const confirmGoogleAnalyticsLinkIsPresent = () => {
  // cy.get('head script[data-cy="Google Analytics"]').should(
  //   'have.attr',
  //   'src',
  //   'https://www.googletagmanager.com/gtag/js?id=',
  // );
 // cy.wait(Cypress.env('demoDelay'));
 //  cy.xpath('//html//body//noscript//text()').invoke('text').then((text)=>{
 //    expect(text).to.contain('https://www.googletagmanager.com');
 //  });
  cy.xpath('//body').within(()=>{
    cy.xpath('.//noscript').invoke('text').then((text)=>{
      expect(text).to.contain('https://www.googletagmanager.com');
    });
  })
};
