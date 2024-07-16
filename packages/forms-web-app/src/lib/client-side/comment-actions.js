document.addEventListener('DOMContentLoaded', () => {
	const readMoreButtons = document.querySelectorAll('.read-more');
	const closeButtons = document.querySelectorAll('.close-button');
	readMoreButtons.forEach((button) => {
		button.addEventListener('click', (event) => {
			const target = event.target;
			if (target instanceof HTMLElement) {
				const index = target.dataset.index;
				const commentTextElement = document.getElementById(`comment-text-${index}`);
				const fullText = commentTextElement ? commentTextElement.dataset.fullText : '';
				const closeButton = document.getElementById(`close-button-${index}`);
				if (commentTextElement) {
					commentTextElement.textContent = fullText;
				}
				target.classList.add('hidden');
				target.classList.remove('visible');
				closeButton?.classList.remove('hidden');
			}
		});
	});
	closeButtons.forEach((button) => {
		button.addEventListener('click', (event) => {
			const target = event.target;
			if (target instanceof HTMLElement) {
				const index = target.dataset.index;
				console.log(index);
				const commentTextElement = document.getElementById(`comment-text-${index}`);
				const truncatedText = commentTextElement ? commentTextElement.dataset.truncatedText : '';
				const readMoreButton = document.getElementById(`read-more-button-${index}`);
				if (commentTextElement) {
					commentTextElement.textContent = truncatedText;
				}
				target.classList.add('hidden');
				readMoreButton?.classList.remove('hidden');
			}
		});
	});
});
