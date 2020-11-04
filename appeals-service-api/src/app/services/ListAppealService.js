import Appeal from '../schemas/AppealSchema';

class ListAppealService {
  static run(filter) {
    return Appeal.find(filter);
  }
}

export default new ListAppealService();
