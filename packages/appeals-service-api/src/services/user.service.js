const logger = require('../lib/logger');
const mongodb = require('../db/db');
const ObjectId = require('mongodb').ObjectId;
const ApiError = require('../errors/apiError');
const LpaService = require('../services/lpa.service');
const lpaService = new LpaService();
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

const userProjection = {
	projection: {
		_id: 1,
		email: 1,
		lpaCode: 1,
		isAdmin: 1,
		status: 1
	}
};

function compareUserConfirmedAt(a, b) {
	if (!b.confirmedAt || !a.confirmedAt) {
		return 0;
	}

	return b.confirmedAt.getTime() - a.confirmedAt.getTime();
}

const getUsers = async (lpaCode) => {
	const result = [];

	if (!lpaCode) {
		throw ApiError.userNoLpaCodeProvided();
	}

	try {
		const cursor = await mongodb
			.get()
			.collection('user')
			.find({ lpaCode: lpaCode, status: STATUS_CONSTANTS.CONFIRMED });

		await cursor.forEach((doc) => {
			result.push({
				_id: doc._id,
				email: doc.email,
				lpaCode: doc.lpaCode,
				isAdmin: doc.isAdmin,
				confirmedAt: doc.confirmedAt
			});
		});
	} catch (err) {
		logger.error(err);
		throw err;
	}

	result.sort(compareUserConfirmedAt);
	return result;
};

const createUser = async (user) => {
	if (!user || !user.lpaCode || !user.email) {
		throw ApiError.badRequest();
	}

	user.createdAt = new Date();
	user.status = STATUS_CONSTANTS.ADDED;

	if (!user.isAdmin) {
		user.isAdmin = false;
	}

	try {
		// ensure only 1 admin per lpa
		if (user.isAdmin) {
			const adminCount = await mongodb
				.get()
				.collection('user')
				.countDocuments({ lpaCode: user.lpaCode, isAdmin: true }, { limit: 1 });

			if (adminCount > 0) {
				throw ApiError.userOnly1Admin();
			}
		}

		// ensure email matches lpa domain
		const lpa = await lpaService.getLpaByCode(user.lpaCode);

		if (!lpa || !lpa.getDomain() || !user.email.endsWith(lpa.getDomain())) {
			throw ApiError.userBadLpa();
		}

		await mongodb.get().collection('user').insertOne(user);
	} catch (err) {
		logger.error(err, `Error: user not created`);

		if (err?.code === mongodb.errorCodes.DUPLICATE_KEY) {
			throw ApiError.userDuplicate();
		}

		throw err;
	}
};

const getUserByEmail = async (email) => {
	let user;

	try {
		user = await mongodb.get().collection('user').findOne(
			{
				email: email
			},
			userProjection
		);
	} catch (err) {
		logger.error(err, `Error: getting user`);
		throw err;
	}

	if (!user) {
		throw ApiError.userNotFound();
	}

	if (user.status === STATUS_CONSTANTS.REMOVED) {
		throw ApiError.userDisabled();
	}

	return user;
};

const getUserById = async (id) => {
	let user;

	try {
		user = await mongodb
			.get()
			.collection('user')
			.findOne(
				{
					_id: new ObjectId(id)
				},
				userProjection
			);
	} catch (err) {
		logger.error(err, `Error: getting user`);
		throw err;
	}

	if (!user) {
		throw ApiError.userNotFound();
	}

	return user;
};

const disableUser = async (id) => {
	logger.info(`attempting to disable user: ${id}`);
	const user = await getUserById(id);

	if (user.isAdmin) {
		throw ApiError.userCantDisableAdmin();
	}

	try {
		const disabled = await mongodb
			.get()
			.collection('user')
			.findOneAndUpdate(
				{ _id: new ObjectId(id) },
				{ $set: { status: STATUS_CONSTANTS.REMOVED } },
				{ returnDocument: 'after' }
			);
		logger.info(`disabled user: ${disabled._id}`);
	} catch (err) {
		logger.error(err, `Error: error attempting to delete user`);
		throw err;
	}
};

const setUserStatus = async (id, status) => {
	logger.info(`attempting to set user status: ${id}`);

	try {
		const updated = await mongodb
			.get()
			.collection('user')
			.findOneAndUpdate(
				{ _id: new ObjectId(id) },
				{ $set: { confirmedAt: new Date(), status: status } },
				{ returnDocument: 'after' }
			);
		logger.info(`set user status: ${updated._id}`);
	} catch (err) {
		logger.error(err, `Error: error attempting to set user status`);
		throw err;
	}
};

module.exports = {
	getUsers,
	createUser,
	getUserByEmail,
	getUserById,
	disableUser,
	setUserStatus
};
