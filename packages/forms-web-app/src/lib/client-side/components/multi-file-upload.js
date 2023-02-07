const LABELS = {
	addedFileDeleteButtonText: 'Remove',
	dropzoneButtonText: 'Select files',
	dropzoneHintText: 'Drag and drop files here or'
};

const SELECTORS = {
	container: '.moj-multi-file-upload',
	internal: {
		fileInput: '.moj-multi-file-upload__input',
		filesAddedContainer: '.moj-multi-file__uploaded-files-container',
		filesAddedList: '.moj-multi-file-upload__list'
	}
};

const CLASSES = {
	addedFileDeleteButton: 'moj-multi-file-upload__delete',
	container: 'moj-multi-file-upload--enhanced',
	dragOver: 'moj-multi-file-upload__dropzone--dragover',
	dropZone: 'moj-multi-file-upload__dropzone',
	hidden: 'moj-hidden',
	hint: 'govuk-body',
	label: 'govuk-button govuk-button--secondary',
	labelFocused: 'moj-multi-file-upload--focused',
	visuallyHidden: 'govuk-visually-hidden'
};

const ATTRIBUTES = {
	addedFileDeleteButton: {
		fileInfoLastModified: 'data-fileinfo-lastmodified',
		fileInfoName: 'data-fileinfo-name',
		fileInfoSize: 'data-fileinfo-size',
		fileInfoType: 'data-fileinfo-type'
	}
};

const instances = [];

function multiFileUpload(document, container) {
	const elements = {};
	let filesAdded = [];

	function onFileInputChange(event) {
		event.preventDefault();
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

	function tryDeleteAddedFile(deleteButton) {
		const name = deleteButton.getAttribute(ATTRIBUTES.addedFileDeleteButton.fileInfoName);
		const size = deleteButton.getAttribute(ATTRIBUTES.addedFileDeleteButton.fileInfoSize);
		const lastModified = deleteButton.getAttribute(
			ATTRIBUTES.addedFileDeleteButton.fileInfoLastModified
		);
		const type = deleteButton.getAttribute(ATTRIBUTES.addedFileDeleteButton.fileInfoType);

		filesAdded = filesAdded.filter(
			(file) =>
				`${file.name}` !== name ||
				`${file.size}` !== size ||
				`${file.lastModified}` !== lastModified ||
				`${file.type}` !== type
		);

		updateFilesAddedUI();
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
					<li class="govuk-summary-list__row moj-multi-file-upload__row">
						<div class="govuk-summary-list__value moj-multi-file-upload__message">
							<span class="moj-multi-file-upload__filename">${file.name}</span>
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
							</button>
						</div>
					</li>
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
