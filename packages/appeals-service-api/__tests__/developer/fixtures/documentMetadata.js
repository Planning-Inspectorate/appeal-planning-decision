const uuid = require('uuid');
const crypto = require('crypto');

const DOCUMENT_TYPES = {
	PLANNING_APPLICATION_FORM: 'Planning application form',
	SUPPORTING_DOCUMENTS: 'Supporting Documents',
	APPEAL_STATEMENT: 'Appeal Statement',
	DECISION_NOTICE: 'Decision notice'
};

const getRandomInt = (max) => {
	return Math.floor(Math.random() * max);
};

let threeByteCounter = [
	getRandomInt(255).toString(16),
	getRandomInt(255).toString(16),
	getRandomInt(255).toString(16)
];

const fakeDocumentMetadata = () => {
	const fakeDocuments = [];
	for (let i = 0; i < 100; i++) {
		let fakeCaseRef = generateFakeCaseRef();
		fakeDocuments.push(_generateFakeDocumentMetadata(fakeCaseRef, DOCUMENT_TYPES.APPEAL_STATEMENT));
		fakeDocuments.push(_generateFakeDocumentMetadata(fakeCaseRef, DOCUMENT_TYPES.DECISION_NOTICE));
		fakeDocuments.push(
			_generateFakeDocumentMetadata(fakeCaseRef, DOCUMENT_TYPES.PLANNING_APPLICATION_FORM)
		);
		fakeDocuments.push(
			_generateFakeDocumentMetadata(fakeCaseRef, DOCUMENT_TYPES.SUPPORTING_DOCUMENTS)
		);
	}
	return { fakeDocuments };
};

const hexToDecimal = (hexValue) => {
	return parseInt(hexValue, 16);
};

const decimalToHex = (decimalValue) => {
	return decimalValue.toString(16);
};

const incrementThreeByRandomCounter = () => {
	let currentCounter = hexToDecimal(threeByteCounter);
	currentCounter++;
	threeByteCounter = decimalToHex(currentCounter);
};

const generateRandomMD5Hash = () => {
	const salt = btoa(getRandomInt(999999999999).toString(16));
	return crypto.createHash('md5').update(salt).digest('hex');
};

const generateFakeMongoObjectId = () => {
	incrementThreeByRandomCounter();
	const fourByteTimeStamp = Math.floor(Date.now() / 1000).toString(16);
	const fiveByteRandomValue = [
		getRandomInt(255).toString(16),
		getRandomInt(255).toString(16),
		getRandomInt(255).toString(16),
		getRandomInt(255).toString(16),
		getRandomInt(255).toString(16)
	].join('');
	return `${fourByteTimeStamp}${fiveByteRandomValue}${threeByteCounter}`;
};

const generateFakeCaseRef = () => {
	return `APP/Q9999/W/22/${getRandomInt(9999999)}`;
};

const _generateFakeDocumentMetadata = (caseRef, documentType) => {
	const fakeFilename = `${uuid.v4()}.pdf`;
	return {
		_id: generateFakeMongoObjectId(),
		documentId: uuid.v4(),
		caseRef: caseRef,
		documentReference: `<${caseRef}><1>`,
		version: getRandomInt(10).toString(),
		examinationRefNo: `XXX-${getRandomInt(999)}`,
		filename: fakeFilename,
		originalFilename: fakeFilename,
		size: 1,
		mime: 'application/pdf',
		documentURI: `https://example.org/${fakeFilename}`,
		path: `/${fakeFilename}`,
		virusCheckStatus: 'scanned',
		fileMD5: generateRandomMD5Hash(),
		dateCreated: new Date().toJSON(),
		lastModified: new Date().toJSON(),
		caseType: 'has',
		documentStatus: 'submitted',
		redactedStatus: 'redacted',
		publishedStatus: 'published',
		datePublished: new Date().toJSON(),
		documentType: documentType,
		securityClassification: 'public',
		sourceSystem: 'back_office',
		origin: 'pins',
		owner: 'someone',
		author: 'someone',
		representative: 'some agency',
		description: 'this is a description',
		stage: 'decision',
		filter1: 'Deadline 2',
		filter2: 'Scoping Option Report'
	};
};

module.exports = { fakeDocumentMetadata, getRandomInt, DOCUMENT_TYPES };
