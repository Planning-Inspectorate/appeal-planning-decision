import { getLocalPlanningDepart } from '../page-objects/local-planning-department-po';

export const enterLocalPlanningDepart = (departmentName) =>{
  getLocalPlanningDepart().select(departmentName);
}
