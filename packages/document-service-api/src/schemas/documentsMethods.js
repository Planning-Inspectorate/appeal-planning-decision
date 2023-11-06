const uuid = require('uuid');
const { downloadFile } = require('../lib/blobStorage');
const { initContainerClient } = require('@pins/common');
const config = require('../configuration/config');

module.exports = class Appeals {
	async downloadFileBuffer() {
		return downloadFile(this.get('blobStorageLocation'), await initContainerClient(config));
	}

	generateId() {
		this.set('id', uuid.v4());
		return this;
	}

	toDTO() {
		return {
			...this.toObject(),
			_id: undefined
		};
	}
};
