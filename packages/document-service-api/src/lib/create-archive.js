const createArchive = async (...args) => {
	// esm only
	const archiverModule = await import('archiver');
	const archiver = archiverModule.default;
	return archiver(...args);
};

module.exports = createArchive;
