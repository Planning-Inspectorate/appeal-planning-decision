import Appeal from '../schemas/AppealSchema';
import GetAppealService from './GetAppealService';

class CreateAppealService {
  /**
   * Create a new appeal
   * @param appealParams
   * @param {String} appealParams.text
   * @returns {Promise}
   */
  async run(data) {
    const appeal = await Appeal.create(data);
    return GetAppealService.run(appeal._id);
  }
}

export default new CreateAppealService();
