module.exports = (sections) => {
  let nbTasks = 0;
  let nbCompleted = 0;

  sections.forEach((section) => {
    nbTasks += section.items.length;
    nbCompleted += section.items.filter((subSection) => subSection.status === 'COMPLETED').length;
  });

  return { nbTasks, nbCompleted };
};
