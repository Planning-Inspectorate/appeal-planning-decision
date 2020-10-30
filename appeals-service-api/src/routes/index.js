import { Router } from 'express';

import appeals from './appeals';

const routes = new Router();

/**
 * Simple responser
 * @param {Request} req
 * @param {Response} res
 */
async function baseResponser(req, res) {
  res.status(200).json({ message: 'ok' });
}

routes.get('/', baseResponser);

/**
 * Appeals route
 */
routes.use('/appeals', appeals);

export default routes;
