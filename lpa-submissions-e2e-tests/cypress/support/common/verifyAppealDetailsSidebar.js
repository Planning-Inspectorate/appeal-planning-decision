import AppealDetails from '../PageObjects/AppealDetailsPageObjects';

const appealDetails = new AppealDetails()

module.exports = ({ applicationNumber, applicationAddress, apellantName }) => {
  appealDetails
    .getPlanningApplicationNumber()
    .contains(applicationNumber);
  appealDetails
    .getPlanningApplicationAddress()
    .contains(applicationAddress);
  appealDetails
    .getPlanningApplicationAppellant()
    .contains(apellantName);
}
