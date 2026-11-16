const createArchive = async (...args) => {
	// esm only
	const { default: archiver } = await import('archiver');
	return archiver(...args);
};

module.exports = createArchive;
