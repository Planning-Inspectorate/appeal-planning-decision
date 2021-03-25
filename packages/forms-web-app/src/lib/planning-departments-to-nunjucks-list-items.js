const departmentsToNunjucksItems = (departments, appealLPD = undefined) => [
  {
    value: undefined,
    text: undefined,
    selected: false,
  },
  ...departments.map((department) => ({
    value: department,
    text: department,
    selected: appealLPD === department,
  })),
];

module.exports = {
  departmentsToNunjucksItems,
};
