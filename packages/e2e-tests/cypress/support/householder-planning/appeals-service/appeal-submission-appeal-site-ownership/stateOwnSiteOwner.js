import {answerOwnsTheWholeAppeal} from "./answerOwnsTheWholeAppeal";
import {answerDoesNotOwnTheWholeAppeal} from "./answerDoesNotOwnTheWholeAppeal";
import {clickSaveAndContinue} from "../../../common/clickSaveAndContinue";
import {getSaveAndContinueButton} from "../../../common-page-objects/common-po";

export const stateOwnSiteOwner = (isWholeOwner) => {
  if (isWholeOwner) {
    answerOwnsTheWholeAppeal();
  } else {
    answerDoesNotOwnTheWholeAppeal();
  }
  getSaveAndContinueButton().click();
}
