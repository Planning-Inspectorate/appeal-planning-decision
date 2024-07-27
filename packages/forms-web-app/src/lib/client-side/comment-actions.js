document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('click', (event) => {
		if (event?.target.classList.contains('toggle-button')) {
			const target = event.target;

			const index = target?.id.split('-').pop();
			const commentTextElement = document.getElementById(`comment-text-${index}`);
			event.preventDefault();

			if (commentTextElement) {
				const isExpanded = target?.textContent === 'Close';
				const textToShow = isExpanded
					? commentTextElement.getAttribute('data-truncated-text')
					: commentTextElement.getAttribute('data-full-text');
				commentTextElement.textContent = textToShow;
				target.textContent = isExpanded ? 'Read more' : 'Close';
			}
		}
	});

	document.querySelectorAll('.comment-text').forEach((element) => {
		const truncatedText = element.getAttribute('data-truncated-text');
		if (truncatedText) {
			element.textContent = truncatedText;
			const toggleButton = document.querySelector(`#toggle-button-${element.id.split('-').pop()}`);
			if (toggleButton) {
				toggleButton.textContent = 'Read more';
			}
		}
	});
});
