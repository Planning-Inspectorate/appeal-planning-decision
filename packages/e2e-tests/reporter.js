const report = require('multiple-cucumber-html-reporter');

report.generate({
  ignoreBadJsonFile: true,
  jsonDir: './cypress/cucumber-json',
  reportPath: './cypress/cucumber-report'
});
