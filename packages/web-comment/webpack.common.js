const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		index: './src/client-side/index.js',
		cookiePreferences: './src/client-side/cookie-preferences-page.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'src', 'public', 'javascripts')
	},
	plugins: []
};
