document.addEventListener('DOMContentLoaded', () => {
	const links = document.querySelectorAll('a.clear-appeal-session');
	links.forEach((link) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();

			fetch('/before-you-start/clear-appeal-session', { method: 'GET' })
				.then(() => {
					window.location.href = link.href;
				})
				.catch((err) => console.error('Error clearing session:', err));
		});
	});
});
