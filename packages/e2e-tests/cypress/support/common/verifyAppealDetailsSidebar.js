import {
  getPlanningApplicationAddress, getPlanningApplicationAppellant,
  getPlanningApplicationNumber,
} from '../householder-planning/lpa-questionnaire/PageObjects/AppealDetailsPageObjects';

export const verifyAppealDetailsSidebar = ({
  applicationNumber = 'ABC/123',
  applicationAddress = '999 Letsby Avenue, Sheffield, South Yorkshire, S9 1XY',
  apellantName = 'Bob Smith',
}) => {
  getPlanningApplicationNumber().contains(applicationNumber);
  getPlanningApplicationAddress().contains(applicationAddress);
  getPlanningApplicationAppellant().contains(apellantName);
};
