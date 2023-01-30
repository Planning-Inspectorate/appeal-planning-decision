const LABELS = {
	dropzoneButtonText: 'Select files',
	dropzoneHintText: 'Drag and drop files here or',
	uploadStatusText: 'Uploading files, please wait',
	addedFileDeleteButtonText: 'Remove'
};

const SELECTORS = {
	container: '.moj-multi-file-upload',
	internal: {
		fileInput: '.moj-multi-file-upload__input',
		filesAddedContainer: '.moj-multi-file__uploaded-files',
		filesAddedList: '.moj-multi-file-upload__list'
	}
};

const CLASSES = {
	container: 'moj-multi-file-upload--enhanced',
	dragOver: 'moj-multi-file-upload__dropzone--dragover',
	dropZone: 'moj-multi-file-upload__dropzone',
	hidden: 'moj-hidden',
	hint: 'govuk-body',
	label: 'govuk-button govuk-button--secondary',
	labelFocused: 'moj-multi-file-upload--focused',
	visuallyHidden: 'govuk-visually-hidden',
	addedFileDeleteButton: 'moj-multi-file-upload__delete'
};

const ATTRIBUTES = {
	addedFileDeleteButton: {
		fileInfoName: 'data-fileinfo-name',
		fileInfoSize: 'data-fileinfo-size',
		fileInfoLastModified: 'data-fileinfo-lastmodified',
		fileInfoType: 'data-fileinfo-type'
	}
};

const instances = [];

function multiFileUpload(document, container) {
	const elements = {};
	let filesAdded = [];

	function onFileInputChange(event) {
		event.preventDefault();
		elements.status[0].innerText = LABELS.uploadStatusText;
		addFiles(event.target.files);
	}

	function onFileInputFocus() {
		elements.label[0]?.classList.add(CLASSES.labelFocused);
	}

	function onFileInputBlur() {
		elements.label[0]?.classList.remove(CLASSES.labelFocused);
	}

	function onDropZoneDragOver(event) {
		event.preventDefault();
		elements.dropZone[0]?.classList.add(CLASSES.dragOver);
		elements.status[0].innerText = LABELS.uploadStatusText;
	}

	function onDropZoneDragLeave(event) {
		event.preventDefault();
		elements.dropZone[0]?.classList.remove(CLASSES.dragOver);
	}

	function onDropZoneDrop(event) {
		event.preventDefault();
		elements.dropZone[0]?.classList.remove(CLASSES.dragOver);
		addFiles(event.dataTransfer?.files);
	}

	function onAddedFileDeleteButtonClick(event) {
		event.preventDefault();
		tryDeleteAddedFile(event.target);
	}

	function setupFileInput() {
		elements.fileInput[0]?.addEventListener('change', onFileInputChange);
		elements.fileInput[0]?.addEventListener('focus', onFileInputFocus);
		elements.fileInput[0]?.addEventListener('blur', onFileInputBlur);
	}

	function setupDropzone(document) {
		const dropZone = document.createElement('div');
		dropZone.className = CLASSES.dropZone;
		elements.fileInput[0]?.parentNode.insertBefore(dropZone, elements.fileInput?.[0]);
		dropZone.appendChild(elements.fileInput?.[0]);

		elements.dropZone = [dropZone];
		elements.dropZone[0]?.addEventListener('dragover', onDropZoneDragOver);
		elements.dropZone[0]?.addEventListener('dragleave', onDropZoneDragLeave);
		elements.dropZone[0]?.addEventListener('drop', onDropZoneDrop);
	}

	function setupLabel(document) {
		const label = document.createElement('label');
		label.className = CLASSES.label;
		label.setAttribute('for', elements.fileInput[0]?.id);
		label.innerText = LABELS.dropzoneButtonText;

		const hint = document.createElement('p');
		hint.className = CLASSES.hint;
		hint.innerText = LABELS.dropzoneHintText;

		elements.dropZone[0]?.appendChild(hint);
		elements.dropZone[0]?.appendChild(label);

		elements.hint = [hint];
		elements.label = [label];
	}

	function setupStatusBox(document) {
		const status = document.createElement('div');
		status.className = CLASSES.visuallyHidden;
		status.setAttribute('aria-live', 'polite');
		status.setAttribute('role', 'status');
		elements.dropZone[0]?.appendChild(status);
		elements.status = [status];
	}

	function tryDeleteAddedFile(deleteButton) {
		const name = deleteButton.getAttribute(ATTRIBUTES.addedFileDeleteButton.fileInfoName);
		const size = deleteButton.getAttribute(ATTRIBUTES.addedFileDeleteButton.fileInfoSize);
		const lastModified = deleteButton.getAttribute(
			ATTRIBUTES.addedFileDeleteButton.fileInfoLastModified
		);
		const type = deleteButton.getAttribute(ATTRIBUTES.addedFileDeleteButton.fileInfoType);

		filesAdded = filesAdded.filter(
			(file) =>
				file.name !== name ||
				file.size !== size ||
				file.lastModified !== lastModified ||
				file.type !== type
		);
	}

	function bindAddedFilesEvents() {
		const addedFileDeleteButtons = elements.container.querySelectorAll(
			`.${CLASSES.addedFileDeleteButton}`
		);

		for (const deleteButton of addedFileDeleteButtons) {
			deleteButton.addEventListener('click', onAddedFileDeleteButtonClick);
		}
	}

	function updateFilesAddedUI() {
		if (filesAdded.length === 0) {
			elements.filesAddedList[0].innerHTML = '';
			elements.filesAddedContainer[0]?.classList.add(CLASSES.hidden);
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
				<div class="govuk-summary-list__actions moj-multi-file-upload__actions">
					<button
						class="${CLASSES.addedFileDeleteButton} govuk-link govuk-!-margin-bottom-0"
						type="button"
						name="delete"
						${ATTRIBUTES.addedFileDeleteButton.fileInfoName}="${file.name}"
						${ATTRIBUTES.addedFileDeleteButton.fileInfoSize}="${file.size}"
						${ATTRIBUTES.addedFileDeleteButton.fileInfoLastModified}="${file.lastModified}"
						${ATTRIBUTES.addedFileDeleteButton.fileInfoType}="${file.type}"
					>
						${LABELS.addedFileDeleteButtonText}
						<span class="govuk-visually-hidden">${file.name}</span>
					</button>
				</div>
			</div>
		`
			)
			.join('')
			.trim()}`;

		elements.filesAddedContainer[0]?.classList.remove(CLASSES.hidden);

		bindAddedFilesEvents();
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

	function addFilesToFileInput() {
		const dataTransfer = new DataTransfer();

		for (const addedFile of filesAdded) {
			dataTransfer.items.add(addedFile);
		}

		elements.fileInput[0].files = dataTransfer.files;
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

		addFilesToFileInput();
		updateFilesAddedUI();
	}

	function initialise(document, container) {
		elements.container = container;

		for (const key in SELECTORS.internal) {
			elements[key] = elements.container.querySelectorAll(SELECTORS.internal[key]);
		}

		elements.container.classList.add(CLASSES.container);

		setupFileInput();
		setupDropzone(document);
		setupLabel(document);
		setupStatusBox(document);
	}

	initialise(document, container);

	return {
		initialise
	};
}

function initialiseMultiFileUpload(document) {
	const containers = document.querySelectorAll(SELECTORS.container);

	for (const container of containers) {
		const instance = multiFileUpload(document, container);

		instances.push(instance);
	}
}

module.exports = {
	initialiseMultiFileUpload
};
