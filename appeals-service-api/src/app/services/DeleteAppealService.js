/** @typedef {import('mongoose').Schema.Types.ObjectId} ObjectId */

import GetAppealService from './GetAppealService';

class DeleteAppealService {
  /**
   * Delete an appeal
   * @param {ObjectId} _id
   * @returns {Promise}
   */
  async run(_id) {
    const appeal = await GetAppealService.run(_id);

    await appeal.remove();
  }
}

export default new DeleteAppealService();
