const TASK_STATUS = {
  CANNOT_START_YET: 'CANNOT START YET',
  NOT_STARTED: 'NOT STARTED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED',
};

class SectionPath {
  constructor(section) {
    this.section = section;
    this.path = [];
  }

  add(pageName) {
    this.path.push({
      page: pageName,
      status: this.section[pageName],
    });
    return this;
  }

  getPath() {
    return this.path;
  }
}

function getStatusOfPath(path) {
  const { NOT_STARTED, IN_PROGRESS, COMPLETED } = TASK_STATUS;
  let result = path[0].status === NOT_STARTED ? NOT_STARTED : IN_PROGRESS;
  if (result === IN_PROGRESS) {
    const statuses = path.map((pathEntry) => pathEntry.status);
    const isCompleted = statuses.every((status) => status === COMPLETED);
    if (isCompleted) {
      result = COMPLETED;
    }
  }
  return result;
}

module.exports = {
  ...TASK_STATUS,
  getStatusOfPath,
  SectionPath,
};
