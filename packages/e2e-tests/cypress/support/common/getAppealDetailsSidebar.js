import AppealDetails from '../householder-planning/lpa-questionnaire/PageObjects/AppealDetailsPageObjects';

const appealDetails = new AppealDetails()

module.exports = () => {
  appealDetails.getAppealDetailsSidebar();
}
