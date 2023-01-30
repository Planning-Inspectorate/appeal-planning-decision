const labels = {
	dropzoneButtonText: 'Choose files',
	dropzoneHintText: 'Drag and drop files here or',
	uploadStatusText: 'Uploading files, please wait'
};

const selectors = {
	container: '.moj-multi-file-upload',
	fileInput: '.moj-multi-file-upload__input',
	filesAddedContainer: '.moj-multi-file__uploaded-files',
	filesAddedList: '.moj-multi-file-upload__list'
};

const classes = {
	container: 'moj-multi-file-upload--enhanced',
	dragOver: 'moj-multi-file-upload--dragover',
	dropZone: 'moj-multi-file-upload__dropzone',
	hidden: 'moj-hidden',
	hint: 'govuk-body',
	label: 'govuk-button govuk-button--secondary',
	visuallyHidden: 'govuk-visually-hidden'
};

const elements = {};

const filesAdded = [];

function onFileInputChange(event) {
	event.preventDefault();
	elements.status[0].innerText = labels.uploadStatusText;
	addFiles(event.target.files);
}

function onFileInputFocus(event) {
	console.log('onFileInputFocus event: ', event);
}

function onFileInputBlur(event) {
	console.log('onFileInputBlur event: ', event);
}

function onDropZoneDragOver(event) {
	event.preventDefault();
	elements.dropZone[0]?.classList.add(classes.dragOver);
	elements.status[0].innerText = labels.uploadStatusText;
}

function onDropZoneDragLeave(event) {
	event.preventDefault();
	elements.dropZone[0]?.classList.remove(classes.dragOver);
}

function onDropZoneDrop(event) {
	event.preventDefault();
	elements.dropZone[0]?.classList.remove(classes.dragOver);
	addFiles(event.dataTransfer?.files);
}

function setupFileInput() {
	elements.fileInput[0]?.addEventListener('change', onFileInputChange);
	elements.fileInput[0]?.addEventListener('focus', onFileInputFocus);
	elements.fileInput[0]?.addEventListener('blur', onFileInputBlur);
}

function setupDropzone(document) {
	const dropZone = document.createElement('div');
	dropZone.className = classes.dropZone;
	elements.fileInput[0]?.parentNode.insertBefore(dropZone, elements.fileInput?.[0]);
	dropZone.appendChild(elements.fileInput?.[0]);

	elements.dropZone = [dropZone];
	elements.dropZone[0]?.addEventListener('dragover', onDropZoneDragOver);
	elements.dropZone[0]?.addEventListener('dragleave', onDropZoneDragLeave);
	elements.dropZone[0]?.addEventListener('drop', onDropZoneDrop);
}

function setupLabel(document) {
	const label = document.createElement('label');
	label.className = classes.label;
	label.setAttribute('for', elements.fileInput[0]?.id);
	label.innerText = labels.dropzoneButtonText;

	const hint = document.createElement('p');
	hint.className = classes.hint;
	hint.innerText = labels.dropzoneHintText;

	elements.dropZone[0]?.appendChild(hint);
	elements.dropZone[0]?.appendChild(label);
}

function setupStatusBox(document) {
	const status = document.createElement('div');
	status.className = classes.visuallyHidden;
	status.setAttribute('aria-live', 'polite');
	status.setAttribute('role', 'status');
	elements.dropZone[0]?.appendChild(status);
	elements.status = [status];
}

function updateFilesAddedUI() {
	if (filesAdded.length === 0) {
		elements.filesAddedList[0].innerHTML = '';
		elements.filesAddedContainer[0]?.classList.add(classes.hidden);
		return;
	}

	elements.filesAddedList[0].innerHTML = `${filesAdded
		.map(
			(file) => `
			<div class="govuk-summary-list__row moj-multi-file-upload__row">
				<div class="govuk-summary-list__value moj-multi-file-upload__message">
					<span class="moj-multi-file-upload__filename">${file.name}</span>
					<span class="moj-multi-file-upload__progress">0%</span>
				</div>
				<div class="govuk-summary-list__actions moj-multi-file-upload__actions"></div>
			</div>
		`
		)
		.join('')
		.trim()}`;
	elements.filesAddedContainer[0]?.classList.remove(classes.hidden);
}

function fileAlreadyAdded(file) {
	for (const addedFile of filesAdded) {
		if (
			file.name === addedFile.name &&
			file.size === addedFile.size &&
			file.lastModified === addedFile.lastModified &&
			file.type === addedFile.type
		) {
			return true;
		}
	}

	return false;
}

function addFiles(files) {
	if (!(files instanceof FileList)) {
		return;
	}

	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		if (!fileAlreadyAdded(file)) {
			filesAdded.push(file);
		}
	}

	updateFilesAddedUI();
}

function initialiseMultiFileUpload(document) {
	for (const key in selectors) {
		elements[key] = document.querySelectorAll(selectors[key]);
	}

	elements.container[0]?.classList.add(classes.container);

	setupFileInput();
	setupDropzone(document);
	setupLabel(document);
	setupStatusBox(document);
}

module.exports = {
	initialiseMultiFileUpload
};
