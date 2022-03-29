import {answerHaveToldOtherOwnersAppeal} from "./answerHaveToldOtherOwnersAppeal";
import {answerHaveNotToldOtherOwnersAppeal} from "./answerHaveNotToldOtherOwnersAppeal";
import {getSaveAndContinueButton} from "../../../common-page-objects/common-po";

export const stateOtherOwnersBeenTold = (areOtherOwnersTold) => {
  if (areOtherOwnersTold) {
    answerHaveToldOtherOwnersAppeal();
  } else {
    answerHaveNotToldOtherOwnersAppeal();
  }
  getSaveAndContinueButton().click();
}
