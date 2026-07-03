const { randomUUID } = require('node:crypto');
const { downloadFile } = require('../lib/blobStorage');
const { initContainerClient } = require('@pins/common');
const config = require('../configuration/config');

module.exports = class Appeals {
	async downloadFileBuffer() {
		return downloadFile(this.get('blobStorageLocation'), await initContainerClient(config));
	}

	generateId() {
		this.set('id', randomUUID());
		return this;
	}

	toDTO() {
		return {
			...this.toObject(),
			_id: undefined
		};
	}
};
