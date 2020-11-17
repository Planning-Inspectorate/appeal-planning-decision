const PLANNING_DEPARTMENT = 'eligibility/planning-department';

const LPAS = [
  { id: 'E60000281', name: 'Adur LPA', inTrial: true, england: true, wales: false },
  { id: 'E60000019', name: 'Allerdale LPA', inTrial: false, england: true, wales: false },
  { id: 'E60000077', name: 'Amber Valley LPA', inTrial: false, england: true, wales: false },
  { id: 'E60000282', name: 'Arun LPA', inTrial: false, england: true, wales: false },
  { id: 'E60000106', name: 'Ashfield LPA', inTrial: false, england: true, wales: false },
  { id: 'E60000253', name: 'Ashford LPA', inTrial: false, england: true, wales: false },
];

/* Get planning department  */
exports.getPlanningDepartment = (req, res) => {
  const data = JSON.stringify(LPAS.map(({ name }) => name));
  res.render(PLANNING_DEPARTMENT, { data });
};
