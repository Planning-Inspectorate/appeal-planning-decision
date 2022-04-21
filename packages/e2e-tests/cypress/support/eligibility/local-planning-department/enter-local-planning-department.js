import { getLocalPlanningDepart } from '../page-objects/local-planning-department-po';

export const enterLocalPlanningDepartment = (departmentName) =>{
  getLocalPlanningDepart().select(departmentName);
}
