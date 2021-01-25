module.exports = (sections) => {
  let nbTasks = 0;
  let nbCompleted = 0;

  sections.forEach((section) => {
    nbTasks += section.items.length;
    nbCompleted += section.items.filter((subSection) => subSection.status === 'COMPLETED').length;
  });

  const completedSections = sections.reduce(
    (acc, section) =>
      section.items.filter((subSection) => subSection.status === 'COMPLETED').length ===
      section.items.length
        ? acc + 1
        : acc,
    0
  );

  return {
    nbTasks,
    nbCompleted,
    sections: {
      count: sections.length,
      completed: completedSections,
    },
  };
};
