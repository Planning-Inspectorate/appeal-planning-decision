/** @typedef {import ('express').Request} Request */
/** @typedef {import ('express').Response} Response */

import CreateAppealService from '../services/CreateAppealService';
import GetAppealService from '../services/GetAppealService';
import ListAppealService from '../services/ListAppealService';
import UpdateAppealService from '../services/UpdateAppealService';
import DeleteAppealService from '../services/DeleteAppealService';
import ControllerUtil from '../utils/ControllerUtil';

class AppealController extends ControllerUtil {
  constructor() {
    super();

    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.index = this.index.bind(this);
    this.destroy = this.destroy.bind(this);
    this.show = this.show.bind(this);
  }

  /**
   * List all appeals.
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const promise = (async () => ListAppealService.run(req.query))();

    return this.defaultHandler(res, promise);
  }

  /**
   * Return a specific appeal.
   * @param {Request} req
   * @param {Response} res
   */
  async show(req, res) {
    const { _id } = req.params;
    const promise = (async () => GetAppealService.run(_id, req.body))();

    return this.defaultHandler(res, promise);
  }

  /**
   * Insert a new appeal.
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const promise = (async () => CreateAppealService.run(req.body))();

    return this.defaultHandler(res, promise);
  }

  /**
   * Update an appeal.
   * @param {Request} req
   * @param {Response} res
   */
  async update(req, res) {
    const { _id } = req.params;
    const promise = (async () => UpdateAppealService.run(_id, req.body))();

    return this.defaultHandler(res, promise);
  }

  /**
   * Remove an appeal
   * @param {Request} req
   * @param {Response} res
   */
  async destroy(req, res) {
    const { _id } = req.params;
    const promise = (async () => DeleteAppealService.run(_id, req.body))();

    return this.defaultHandler(res, promise);
  }
}

export default new AppealController();
