const logger = require('../lib/logger');
const mongodb = require('../db/db');
const ObjectId = require('mongodb').ObjectId;
const ApiError = require('../errors/apiError');
const LpaService = require('../services/lpa.service');
const { userStatus } = require('../lib/user-status');
const lpaService = new LpaService();
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

const userProjection = {
	projection: {
		_id: 1,
		email: 1,
		lpaCode: 1,
		isAdmin: 1,
		enabled: 1,
		status: 1
	}
};

function compareUser(a, b) {
	// isAdmin comes first
	if (a.isAdmin && !b.isAdmin) {
		return -1;
	} else if (!a.isAdmin && b.isAdmin) {
		return 1;
	}

	// Otherwise sort by name
	return a.email.localeCompare(b.email);
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
			.find({ lpaCode: lpaCode, enabled: true, status: STATUS_CONSTANTS.CONFIRMED });
		// to sort from mongo instead of locally
		// .sort({ isAdmin: -1, email: 1 });

		await cursor.forEach((doc) => {
			result.push({
				_id: doc._id,
				email: doc.email,
				lpaCode: doc.lpaCode,
				isAdmin: doc.isAdmin
			});
		});
	} catch (err) {
		logger.error(err);
		throw err;
	}

	result.sort(compareUser);
	return result;
};

const createUser = async (user) => {
	if (!user || !user.lpaCode || !user.email) {
		throw ApiError.badRequest();
	}

	user.enabled = true; //todo: decide what to do with this field in light of status field
	user.createdAt = new Date();
	user.status = STATUS_CONSTANTS.ADDED;

	if (!user.isAdmin) {
		user.status = userStatus.added;
		user.isAdmin = false;
	}

	try {
		// ensure only 1 admin per lpa
		if (user.isAdmin) {
			const currentUsers = await getUsers(user.lpaCode);
			if (currentUsers.some((obj) => obj.isAdmin === true)) {
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

		if (err.code === mongodb.errorCodes.DUPLICATE_KEY) {
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

	if (!user.enabled) {
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
				{ $set: { enabled: false } },
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
