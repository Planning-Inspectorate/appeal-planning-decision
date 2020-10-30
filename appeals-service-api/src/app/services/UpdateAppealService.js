/** @typedef {import('mongoose').Schema.Types.ObjectId} ObjectId */
/** @typedef {import('mongoose').Document} Document */

import Appeal from '../schemas/AppealSchema';
import GetAppealService from './GetAppealService';

class UpdateAppealService {
  /**
   * Update to-do task data based on _id
   * @param {ObjectId} _id
   * @param {Appeal} data
   * @returns {Document}
   */
  async run(_id, { _id: _, ...data }) {
    await Appeal.findByIdAndUpdate(_id, data);

    const appeal = await GetAppealService.run(_id);

    return appeal;
  }
}

export default new UpdateAppealService();
