import { Router } from 'express';

import StoreValidator from '../app/validators/Appeal/StoreValidator';
import UpdateValidator from '../app/validators/Appeal/UpdateValidator';
import AppealController from '../app/controllers/AppealController';

const routes = new Router();

routes.route('/').post([StoreValidator], AppealController.store).get(AppealController.index);

routes
  .route('/:_id')
  .get(AppealController.show)
  .put([UpdateValidator], AppealController.update)
  .delete(AppealController.destroy);

export default routes;
