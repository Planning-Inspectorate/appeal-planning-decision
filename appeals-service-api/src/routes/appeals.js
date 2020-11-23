const { Router } = require('express');
const appealsController = require('../controllers/appeals');

const routes = new Router();

routes
  .route('/')
  .post(appealsController.create)
  .get(appealsController.list);

routes
  .route('/:uuid')
  .delete(appealsController.delete)
  .get(appealsController.get)
  .put(appealsController.update);

routes
  .route('/files/upload')
  .post(appealsController.uploadFile)

module.exports = routes;

/**
 * @swagger
 * /appeals:
 *    get:
 *      tags : [Appeals]
 *      summary: Get all appeals
 *      description: Get all appeals
 *      parameters:
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of appeals
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
 *                      $ref: '#/components/schemas/Appeal'
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
 *    post:
 *      tags: [Appeals]
 *      summary: Create an appeal
 *      description: Create an appeal, and return an UUID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - text
 *              properties:
 *                text:
 *                  type: string
 *              example:
 *                text: Lorem ipsum dolor sit amet
 *      responses:
 *        "200":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Appeal'
 *
 */

/**
 * @swagger
 *  /appeals/{uuid}:
 *    get:
 *      tags : [Appeals]
 *      summary: Get an appeal
 *      description: Get an appeal by UUID
 *      parameters:
 *        - in: path
 *          name: uuid
 *          required: true
 *          schema:
 *            type: string
 *          description: Universally Unique Identifier
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Appeal'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete an appeal
 *      description: Delete an appeal by UUID
 *      tags: [Appeals]
 *      parameters:
 *        - in: path
 *          name: uuid
 *          required: true
 *          schema:
 *            type: string
 *          description: Universally Unique Identifier
 *      responses:
 *        "204":
 *          description: No content
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    put:
 *      summary: Update an appeal
 *      description: Update an appeal by UUID
 *      tags: [Appeals]
 *      parameters:
 *        - in: path
 *          name: uuid
 *          required: true
 *          schema:
 *            type: string
 *          description: Universally Unique Identifier
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                uuid:
 *                  type: string
 *                original-appellant:
 *                  type: boolean
 *                appellant-name:
 *                  type: string
 *                appellant-email:
 *                  type: string
 *                behalf-appellant-name:
 *                  type: string
 *                application-number:
 *                  type: string
 *                application-upload:
 *                  type: string
 *                decision-upload:
 *                  type: string
 *                appeal-upload:
 *                  type: string
 *                appeal-non-sensitive:
 *                  type: boolean
 *                appeal-other-uploads:
 *                  type: string
 *                active-appeal:
 *                  type: boolean
 *                active-appeal-numbers:
 *                  type: string
 *                site-address-line-one:
 *                  type: string
 *                site-address-line-two:
 *                  type: string
 *                site-town-city:
 *                  type: string
 *                site-county:
 *                  type: string
 *                site-postcode:
 *                  type: string
 *                site-ownership:
 *                  type: boolean
 *                inform-owners:
 *                  type: boolean
 *                site-view:
 *                  type: boolean
 *                site-restrictions:
 *                  type: string
 *                safety-concerns:
 *                  type: boolean
 *                safety-information:
 *                  type: string
 *                local-planning-authority:
 *                  type: string
 *                description-development:
 *                  type: string
 *              example:
 *                uuid: ed283807-866b-4089-bcec-56b2137a845b
 *                appellant-name: Fred Smith
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Appeal'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
