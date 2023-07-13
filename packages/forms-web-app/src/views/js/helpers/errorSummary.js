const ErrorSummary = () => {
	return {
		getErrorSummary: () => document.getElementByClassName('govuk-error-summary')[0],
		getErrorSummaryList: () => ErrorSummary.getErrorSummary().querySelectorAll('ul')[0],
		getErrorSummaryListItem: (item) =>
			[...ErrorSummary.getErrorSummaryList().querySelectorAll('li')].filter((el) =>
				el.textContent.includes(item)
			).length > 0
				? true
				: false,
		showErrorSummaryBlock: () => {
			const errorSummary = ErrorSummary.getErrorSummary();
			errorSummary.style.display = 'block';
		},
		hideErrorSummaryBlock: () => {
			const errorSummary = ErrorSummary.getErrorSummary();
			errorSummary.style.display = 'none';
		},
		setError: (errorMessage) => {
			if (ErrorSummary.getErrorSummaryListItem(errorMessage)) return;
			const errorSummaryList = ErrorSummary.getErrorSummaryList();
			let error = document.createElement('li');
			error.textContent = errorMessage;
			errorSummaryList.appendChild(error);
		}
	};
};

module.exports = ErrorSummary;
