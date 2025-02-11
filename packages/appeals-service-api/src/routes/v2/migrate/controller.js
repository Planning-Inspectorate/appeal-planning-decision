const { createPrismaClient } = require('#db-client');
const mongodb = require('../../../db/db');
const config = require('../../../configuration/config');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

const MAX_IDS_TO_LOG = 10_000;

/**
 * @type {import('express').Handler}
 */
async function migrateAppeals(req, res) {
	const { exclude, batchSize, batchDelay, stopAfter } = req.query;
	const BATCH_SIZE = parseInt(batchSize, 10) || config.migration.defaultBatchSize;
	const BATCH_DELAY_MS = parseInt(batchDelay, 10) || config.migration.defaultDelayBetweenBatchesMS;
	const STOP_AFTER = parseInt(stopAfter, 10) || 0;
	const sqlClient = createPrismaClient();

	const result = {
		total: 0, // records checked
		alreadyProcessed: 0, // already migrated
		skipped: 0, // not enough data
		migrated: 0, // successfully migrated
		migratedIds: [], // appeal ids that were successful
		errors: [] // appeal id with error message
	};

	const existingIds = await getExistingIds();

	const existingUserMap = await getExistingUsersMap();

	const cursor = exclude ? await findAppeals(existingIds) : await findAppeals();

	let processed = 0;

	try {
		while (await cursor.hasNext()) {
			// delay between batches, query is sent on hasNext
			if (processed === BATCH_SIZE - 1) {
				await delay(BATCH_DELAY_MS);
				processed = 0;
			}
			processed++;

			const doc = await cursor.next();
			await processAppeal(doc);

			// if defined stop processing
			if (STOP_AFTER && result.migrated >= STOP_AFTER) {
				break;
			}
		}
	} finally {
		await cursor.close();
	}

	res.status(200).json(result);

	/**
	 * @returns {Promise<[string]>}
	 */
	async function getExistingIds() {
		const existingAppealsResult = await sqlClient.appeal.findMany({
			select: {
				legacyAppealSubmissionId: true
			},
			where: {
				NOT: [
					{
						legacyAppealSubmissionId: null
					}
				]
			}
		});

		return existingAppealsResult.map((obj) => obj.legacyAppealSubmissionId);
	}

	/**
	 * @returns {Promise<Map<string, string>>}
	 */
	async function getExistingUsersMap() {
		const existingUsersResult = await sqlClient.appealUser.findMany({
			select: {
				email: true,
				id: true
			}
		});

		return new Map(existingUsersResult.map((obj) => [obj.email, obj.id]));
	}

	/**
	 * @param {[string]} [existingIds]
	 * @returns {Promise<import('mongodb').Cursor>}
	 */
	async function findAppeals(existingIds) {
		let lookupQuery = {};

		if (existingIds) {
			lookupQuery = {
				_id: { $nin: existingIds }
			};
		}

		return await mongodb
			.get()
			.collection('appeals')
			.find(lookupQuery, {
				batchSize: BATCH_SIZE,
				projection: {
					_id: 1,
					'appeal.email': 1,
					'appeal.decisionDate': 1,
					'appeal.state': 1,
					'appeal.contactDetailsSection.isOriginalApplicant': 1, // S78
					'appeal.aboutYouSection.yourDetails.isOriginalApplicant': 1 // HAS
				}
			});
	}

	/**
	 * @typedef {Object} AppealQueryResult
	 * @property {string} _id
	 * @property {{
	 * 	email: string,
	 *  decisionDate: string|Date,
	 *  state: string,
	 *  contactDetailsSection: {
	 * 		isOriginalApplicant: boolean
	 * },
	 * aboutYouSection: {
	 * 		yourDetails: {
	 *			isOriginalApplicant: boolean
	 *		}
	 * }
	 * }} appeal
	 */

	/**
	 * @param {AppealQueryResult} doc
	 * @returns {Promise<void>}
	 */
	async function processAppeal(doc) {
		try {
			result.total++;

			// check if appeal already processed
			if (existingIds.includes(doc._id)) {
				result.alreadyProcessed++;
				return;
			}

			// skip appeals without an required data
			if (!doc.appeal.email || !doc.appeal.decisionDate || !doc.appeal.state) {
				result.skipped++;
				return;
			}

			// add to sql
			const userId = await getOrCreateUser(doc.appeal.email);
			await createAndLinkAppeal(doc, userId);

			result.migrated++;

			// Stop holding record of migrated appeals after count exceeds threshold
			// avoid excessive memory usage + response size
			if (result.migrated <= MAX_IDS_TO_LOG) {
				result.migratedIds.push(doc._id);
			}

			if (result.migrated === MAX_IDS_TO_LOG + 1) {
				result.migratedIds.push('ending id logs...');
			}
		} catch (err) {
			result.errors.push({ appealId: doc._id, error: err.message });
		}
	}

	/**
	 * @param {string} email
	 * @returns {Promise<string>}
	 */
	async function getOrCreateUser(email) {
		let userId = existingUserMap.get(email);

		if (!userId) {
			const user = await sqlClient.appealUser.create({
				data: {
					email: email
				}
			});

			existingUserMap.set(email, user.id);
			userId = user.id;
		}

		return userId;
	}

	/**
	 * @param {AppealQueryResult} doc
	 * @param {string} userId
	 */
	async function createAndLinkAppeal(doc, userId) {
		await sqlClient.$transaction(async (transaction) => {
			const appeal = await transaction.appeal.create({
				data: {
					legacyAppealSubmissionId: doc._id,
					legacyAppealSubmissionDecisionDate: doc.appeal.decisionDate,
					legacyAppealSubmissionState: doc.appeal.state
				}
			});

			let role = APPEAL_USER_ROLES.APPELLANT;

			if (
				doc.appeal?.contactDetailsSection?.isOriginalApplicant === false ||
				doc.appeal?.aboutYouSection?.yourDetails?.isOriginalApplicant === false
			) {
				role = APPEAL_USER_ROLES.AGENT;
			}

			await transaction.appealToUser.create({
				data: {
					appealId: appeal.id,
					userId: userId,
					role: role
				}
			});
		});
	}
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

module.exports = {
	migrateAppeals
};
