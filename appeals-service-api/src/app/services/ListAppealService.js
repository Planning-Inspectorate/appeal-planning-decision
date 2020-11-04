import Appeal from '../schemas/AppealSchema';

class ListAppealService {
  run(filter) {
    return Appeal.find(filter);
  }
}

export default new ListAppealService();
