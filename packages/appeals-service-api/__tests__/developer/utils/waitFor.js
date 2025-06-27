// Ripped off from here: https://github.com/tulios/kafkajs/blob/3d4b2d22504f9bf9a977e4a7f84c93006d4bdd73/src/utils/waitFor.js
const sleep = require('./sleep');

module.exports = (
	fn,
	{
		delay = 50,
		maxWait = 10000,
		timeoutMessage = 'Timeout from __tests__/developer/utils/waitFor.js',
		ignoreTimeout = false
	} = {}
) => {
	let timeoutId;
	let totalWait = 0;
	let fulfilled = false;

	const checkCondition = async (resolve, reject) => {
		totalWait += delay;
		await sleep(delay);

		try {
			const result = await fn(totalWait);
			if (result) {
				fulfilled = true;
				clearTimeout(timeoutId);
				return resolve(result);
			}

			checkCondition(resolve, reject);
		} catch (e) {
			fulfilled = true;
			clearTimeout(timeoutId);
			reject(e);
		}
	};

	return new Promise((resolve, reject) => {
		checkCondition(resolve, reject);

		if (ignoreTimeout) {
			return;
		}

		timeoutId = setTimeout(() => {
			if (!fulfilled) {
				return reject(timeoutMessage);
			}
		}, maxWait);
	});
};
