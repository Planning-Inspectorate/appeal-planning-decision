const catchBlockRule = require('./enforce-catch-block-error-type-guards');
const plugin = { rules: { 'enforce-catch-block-error-type-guards': catchBlockRule } };
module.exports = plugin;
