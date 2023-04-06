const { jsPDF } = require('jspdf');

const textToPdf = (text) => {
	const doc = new jsPDF();

	const FONT_SIZE = 10;
	const INITIAL_X_POSITION = 10;
	const INITIAL_Y_POSITION = 10;
	const LINE_HEIGHT = 4;
	const MAX_WIDTH = 190;

	doc.setFontSize(FONT_SIZE);

	const textLines = doc.splitTextToSize(text, MAX_WIDTH);
	const pageHeight = doc.internal.pageSize.height;
	let cursorY = INITIAL_Y_POSITION;

	textLines.forEach((lineText) => {
		if (cursorY > pageHeight) {
			doc.addPage();
			cursorY = INITIAL_Y_POSITION;
		}
		doc.text(lineText, INITIAL_X_POSITION, cursorY);
		cursorY += LINE_HEIGHT;
	});

	return Buffer.from(doc.output('arraybuffer'));
};

module.exports = {
	textToPdf
};
