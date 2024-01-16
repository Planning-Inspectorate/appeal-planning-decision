const axios = require('axios').default;
const FormData = require('form-data');
const fs = require('fs');

const trailingSlashRegex = /\/$/;

class ClamAVClient {
	/**
	 * @param {string} host - e.g. https://example.com
	 */
	constructor(host) {
		if (!host) {
			throw new Error('host is required');
		}

		/** @type {string} */
		this.host = host.replace(trailingSlashRegex, '');
	}

	/**
	 * sends file to clamav rest server
	 * @param {import('express-fileupload').UploadedFile} fileInformation
	 * @param {string} fileName
	 * @param {number} [maxBodyLength] - maxBodyLength in bytes used by axios
	 * @returns {Promise<boolean>}
	 */
	async scan(fileInformation, fileName, maxBodyLength) {
		if (typeof fileInformation?.tempFilePath !== 'undefined') {
			const readableStream = fs.createReadStream(fileInformation?.tempFilePath);

			const form = new FormData();
			form.append('file', readableStream, 'file');

			const { data } = await axios({
				headers: form.getHeaders(),
				url: this.host,
				data: form,
				method: 'POST',
				maxBodyLength: maxBodyLength ? maxBodyLength * 1.1 : maxBodyLength // add headroom
			});

			if (data?.isInfected === true) {
				throw new Error(`${fileName} contains a virus`);
			}
		}

		return true;
	}
}

module.exports = ClamAVClient;
