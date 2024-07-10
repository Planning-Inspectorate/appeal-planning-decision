import { AdvertisingAppeal } from "../../../../page-objects/prepare-appeal/advertising-appeal";
module.exports = () => {
    const advertisingAppeal = new AdvertisingAppeal();
    advertisingAppeal.checkAdvertisingAppeal('#advertisedAppeal');        
    cy.advanceToNextPage();  
    
};