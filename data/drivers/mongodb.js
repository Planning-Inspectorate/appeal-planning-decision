/**
 * mysql
 */

/* Node modules */

/* Third-party modules */
const { MongoClient } = require('mongodb');

/* Files */

module.exports = class MongoDB {
	constructor() {
		this.opts = {
			url: process.env.MONGODB_URL
		};
	}

	async auth() {
		this.db = new MongoClient(this.opts.url, {
			useUnifiedTopology: true
		});
		await this.db.connect();

		/* Do a dummy query to check connection ok */
		await this.db.db('admin').command({ ping: 1 });
	}

	async close() {
		await this.db.close();
	}

	async insertBulk(collection, dataArr) {
		await this.db.db().collection(collection).insertMany(dataArr);
	}

	async truncate() {
		await this.db.db().dropDatabase();
	}
};
