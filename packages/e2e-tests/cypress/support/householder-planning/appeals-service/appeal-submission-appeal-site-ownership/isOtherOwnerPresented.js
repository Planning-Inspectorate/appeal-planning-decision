import {confirmOtherOwnersAsked} from "./confirmOtherOwnersAsked";
import {confirmSiteOwnershipAccepted} from "./confirmSiteOwnershipAccepted";

export const isOtherOwnerPresented = (isAsked) => {
  if (isAsked) {
    confirmOtherOwnersAsked();
  } else {
    confirmSiteOwnershipAccepted();
  }
}
