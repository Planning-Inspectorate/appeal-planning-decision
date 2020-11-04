/** @typedef {import('mongoose').Schema.Types.ObjectId} ObjectId */
/** @typedef {import('mongoose').Document} Document */

import Appeal from '../schemas/AppealSchema';

class GetAppealService {
  /**
   * Return an appeal based on _id
   *
   * If this appeal wasn't found, return 404 by default.
   * @param {ObjectId} _id
   * @returns {Document}
   */
  async run(_id) {
    const appeal = await Appeal.findById(_id);
    if (!appeal) throw new ValidationError('appeal task not found', 404);
    return appeal;
  }
}

export default new GetAppealService();
