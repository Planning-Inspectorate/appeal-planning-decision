import {confirmWholeSiteOwnerAnswered} from "./confirmWholeSiteOwnerAnswered";
import {confirmOtherSiteOwnerToldAnswered} from "./confirmOtherSiteOwnerToldAnswered";

export const isComponentUpdated = (component, value) => {
  switch (component) {
    case 'site ownership':
      confirmWholeSiteOwnerAnswered(value);
      break;
    case 'other owners told':
      confirmOtherSiteOwnerToldAnswered(value);
      break;
    default:
      throw new Error('Component ' + component + ' unknown');
  }
}
