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
	addedFileItem: 'moj-multi-file-upload__list-item',
	addedFileDeleteButton: 'moj-multi-file-upload__delete',
	removedFilesInput: 'moj-multi-file-upload__removed-files',
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
	addedFileItem: {
		fileInfoName: 'data-fileinfo-name',
		fileInfoSize: 'data-fileinfo-size'
	}
};

const instances = [];

function multiFileUpload(document, container) {
	const elements = {};

	let addedFiles = [];
	let existingFiles = [];
	let removedFiles = [];

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
		tryDeleteAddedFileItem(event.target);
	}

	function setupElements(container) {
		elements.container = container;

		for (const key in SELECTORS.internal) {
			elements[key] = elements.container.querySelectorAll(SELECTORS.internal[key]);
		}

		elements.container.classList.add(CLASSES.container);
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

	function getExistingFiles() {
		const existingFileItems = elements.filesAddedList[0]?.querySelectorAll(
			`.${CLASSES.addedFileItem}`
		);

		for (const existingItem of existingFileItems) {
			existingFiles.push({
				name: existingItem.getAttribute(ATTRIBUTES.addedFileItem.fileInfoName),
				size: existingItem.getAttribute(ATTRIBUTES.addedFileItem.fileInfoSize)
			});
		}
	}

	function setupFilesAddedUI() {
		getExistingFiles();
		updateFilesAddedUI();
	}

	function removeMatchingFilesFromArray(name, array) {
		return array.filter((file) => `${file.name}` !== name);
	}

	function tryDeleteAddedFile(name) {
		addedFiles = removeMatchingFilesFromArray(name, addedFiles);
	}

	function tryDeleteExistingFile(name) {
		const fileToRemove = {
			name
		};

		if (!removedFiles.includes(fileToRemove)) {
			removedFiles.push(fileToRemove);
		}

		addRemovedFileDataToForm();
		existingFiles = removeMatchingFilesFromArray(name, existingFiles);
	}

	function tryDeleteAddedFileItem(deleteButton) {
		const parentItem = deleteButton.closest(`.${CLASSES.addedFileItem}`);
		const name = parentItem.getAttribute(ATTRIBUTES.addedFileItem.fileInfoName);

		tryDeleteAddedFile(name);
		tryDeleteExistingFile(name);
		applyAddedFilesToFileInput();
		updateFilesAddedUI();
	}

	function bindFilesAddedEvents() {
		const addedFileDeleteButtons = elements.container.querySelectorAll(
			`.${CLASSES.addedFileDeleteButton}`
		);

		for (const deleteButton of addedFileDeleteButtons) {
			deleteButton.addEventListener('click', onAddedFileDeleteButtonClick);
		}
	}

	function getFilesAddedHtmlForFiles(files) {
		if (files.length < 1) {
			return '';
		}

		return `${files
			.map(
				(file) => `
					<li
						class="govuk-summary-list__row moj-multi-file-upload__row ${CLASSES.addedFileItem}"
						${ATTRIBUTES.addedFileItem.fileInfoName}="${file.name}"
						${ATTRIBUTES.addedFileItem.fileInfoSize}="${file.size}"
					>
						<div class="govuk-summary-list__value moj-multi-file-upload__message">
							<span class="moj-multi-file-upload__filename">${file.name}</span>
						</div>
						<div class="govuk-summary-list__actions moj-multi-file-upload__actions">
							<button
								class="${CLASSES.addedFileDeleteButton} govuk-link govuk-!-margin-bottom-0"
								type="button"
								name="delete"
							>
								${LABELS.addedFileDeleteButtonText} <span class="govuk-visually-hidden"> ${file.name} </span>
							</button>
						</div>
					</li>
				`
			)
			.join('')
			.trim()}`;
	}

	function updateFilesAddedUI() {
		let newInnerHTML = '';

		newInnerHTML += getFilesAddedHtmlForFiles(existingFiles);
		newInnerHTML += getFilesAddedHtmlForFiles(addedFiles);

		elements.filesAddedList[0].innerHTML = newInnerHTML;

		if (elements.filesAddedList[0].innerHTML.length > 0) {
			elements.filesAddedContainer[0]?.classList.remove(CLASSES.hidden);
		} else {
			elements.filesAddedContainer[0]?.classList.add(CLASSES.hidden);
		}

		bindFilesAddedEvents();
	}

	function applyAddedFilesToFileInput() {
		const dataTransfer = new DataTransfer();

		for (const addedFile of addedFiles) {
			dataTransfer.items.add(addedFile);
		}

		elements.fileInput[0].files = dataTransfer.files;
	}

	function addRemovedFileDataToForm() {
		let removedFilesInput = elements.container.querySelector(`.${CLASSES.removedFilesInput}`);

		if (!removedFilesInput) {
			removedFilesInput = document.createElement('input');
			removedFilesInput.className = CLASSES.removedFilesInput;
			removedFilesInput.style.display = 'none';
			removedFilesInput.setAttribute('type', 'hidden');
			removedFilesInput.setAttribute('name', 'removedFiles');
			elements.container.append(removedFilesInput);
		}

		removedFilesInput.value = JSON.stringify(removedFiles);
	}

	function addOrReplaceFile(file) {
		if (existingFiles.some((existingFile) => existingFile.name === file.name)) {
			tryDeleteExistingFile(file.name);

			if (!addedFiles.includes(file)) {
				addedFiles.push(file);
			}

			return;
		}

		for (let i = 0; i < addedFiles.length; i++) {
			if (addedFiles[i].name === file.name) {
				addedFiles[i] = file;

				return;
			}
		}

		addedFiles.push(file);
	}

	function addFiles(files) {
		if (!(files instanceof FileList)) {
			return;
		}

		for (let i = 0; i < files.length; i++) {
			addOrReplaceFile(files[i]);
		}

		applyAddedFilesToFileInput();
		updateFilesAddedUI();
	}

	function initialise(document, container) {
		setupElements(container);
		setupFileInput();
		setupDropzone(document);
		setupLabel(document);
		setupFilesAddedUI();
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
