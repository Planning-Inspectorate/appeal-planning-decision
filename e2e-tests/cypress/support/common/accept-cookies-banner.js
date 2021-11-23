import { getAcceptAnalyticsCookies, getCookiesBannerAcceptedHideMessage } from '../page-objects/common-po';

export const acceptCookiesBanner = () =>{
  getAcceptAnalyticsCookies().click();
  getCookiesBannerAcceptedHideMessage().click();
}
