import { getAcceptAnalyticsCookies, getCookiesBannerAcceptedHideMessage } from '../common-page-objects/common-po';

export const acceptCookiesBanner = () =>{
  getAcceptAnalyticsCookies().click();
  getCookiesBannerAcceptedHideMessage().click();
}
