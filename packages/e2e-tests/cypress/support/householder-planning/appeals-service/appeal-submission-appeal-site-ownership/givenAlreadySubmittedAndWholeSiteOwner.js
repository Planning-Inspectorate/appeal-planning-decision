import {answerOwnsTheWholeAppeal} from "./answerOwnsTheWholeAppeal";
import {answerDoesNotOwnTheWholeAppeal} from "./answerDoesNotOwnTheWholeAppeal";
import {goToAppealsPage} from "../../../common/go-to-page/goToAppealsPage";
import {pageURLAppeal} from "../../../../integration/common/householder-planning/appeals-service/pageURLAppeal";
import {siteOwnership} from "../page-objects/task-list-po";
import {getSaveAndContinueButton} from "../../../common-page-objects/common-po";

export const givenAlreadySubmittedAndWholeSiteOwner = (isAlreadySubmitted, isWholeSiteOwner)=> {
  siteOwnership().click();
  if (isAlreadySubmitted) {
    if (isWholeSiteOwner) {
      answerOwnsTheWholeAppeal();
    } else {
      answerDoesNotOwnTheWholeAppeal();
    }
    getSaveAndContinueButton().click();
    goToAppealsPage(pageURLAppeal.goToWholeSiteOwnerPage);
  }
}
