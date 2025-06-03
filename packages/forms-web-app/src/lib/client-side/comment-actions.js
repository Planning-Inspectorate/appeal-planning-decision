document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('click', (event) => {
		if (event?.target.classList.contains('toggle-button')) {
			const target = event.target;

			const index = target?.id.split('-').pop();
			const commentTextElement = document.getElementById(`truncated-text-${index}`);
			event.preventDefault();

			if (commentTextElement) {
				const isExpanded = target?.textContent === 'Close';
				const truncatedText = commentTextElement.querySelector('.data-truncated-text')?.innerHTML;
				const fullText = commentTextElement.querySelector('.data-full-text')?.innerHTML;
				const visibleText = commentTextElement.querySelector('.data-visible-text');

				if (!target || !visibleText || !truncatedText || !fullText) return;

				visibleText.innerHTML = isExpanded ? truncatedText : fullText;
				target.textContent = isExpanded ? 'Read more' : 'Close';
			}
		}
	});

	document.querySelectorAll('.truncated-text').forEach((element) => {
		const truncatedText = element.querySelector('.data-truncated-text')?.innerHTML;
		const visibleText = element.querySelector('.data-visible-text');
		if (truncatedText && visibleText) {
			visibleText.innerHTML = truncatedText;
			const toggleButton = document.querySelector(`#toggle-button-${element.id.split('-').pop()}`);
			if (toggleButton) {
				toggleButton.textContent = 'Read more';
			}
		}
	});
});
