const express = require('express');
const lpaController = require('../controllers/local-planning-authorities');

const router = express.Router();

router.get('/', lpaController.list);

router.get('/:id', lpaController.get);

module.exports = router;

/**
 * @swagger
 * /local-planning-authorities:
 *    get:
 *      summary: Get all local planning authorities
 *      description: Get all local planning authorities
 *      tags: [Local Planning Authorities]
 *      parameters:
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of lpas
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/LPA'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *
 */

/**
 * @swagger
 *  /local-planning-authorities/{id}:
 *    get:
 *      summary: Get a local planning authority
 *      description: Get a local planning authority by ID
 *      tags : [Local Planning Authorities]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Local Planning Authority Identifier
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/LPA'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 */
