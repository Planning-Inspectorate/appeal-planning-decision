import { getLocalPlanningDepart } from '../page-objects/local-planning-depart';

export const enterLocalPlanningDepart = (departmentName) =>{
  getLocalPlanningDepart().type(departmentName);
}
