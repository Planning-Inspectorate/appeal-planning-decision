import AppealDetails from './PageObjects/AppealDetailsPageObjects';

const appealDetails = new AppealDetails()

module.exports = () => {
  appealDetails.getAppealDetailsSidebar();
}
