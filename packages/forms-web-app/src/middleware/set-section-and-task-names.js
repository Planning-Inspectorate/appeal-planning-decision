const setSectionAndTaskNames = (sectionName, taskName) => {
  return (req, res, next) => {
    req.sectionName = sectionName;
    req.taskName = taskName;
    next();
  };
};

module.exports = setSectionAndTaskNames;
