import AppealDetails from '../householder-planning/lpa-questionnaire/PageObjects/AppealDetailsPageObjects';

const appealDetails = new AppealDetails();

module.exports = ({
  applicationNumber = 'ABC/123',
  applicationAddress = '999 Letsby Avenue, Sheffield, South Yorkshire, S9 1XY',
  apellantName = 'Bob Smith',
}) => {
  appealDetails.getPlanningApplicationNumber().contains(applicationNumber);
  appealDetails.getPlanningApplicationAddress().contains(applicationAddress);
  appealDetails.getPlanningApplicationAppellant().contains(apellantName);
};
