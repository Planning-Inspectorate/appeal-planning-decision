import { getLocalPlanningDepart } from '../../page-objects/full-planning/local-planning-department-po';

export const enterLocalPlanningDepart = (departmentName) =>{
  getLocalPlanningDepart().type(departmentName);
}
