const appealService = require('./appeal-service-api');
const appealReplyService = require('./appeal-reply-service-api');

Cypress.Commands.add('createAppeal', appealService.create);
Cypress.Commands.add('updateAppeal', appealService.update);
Cypress.Commands.add('insertAppeal', appealService.insert);
Cypress.Commands.add('createAppealReply', appealReplyService.create);
Cypress.Commands.add('updateAppealReply', appealReplyService.update);
Cypress.Commands.add('insertAppealReply', appealReplyService.insert);
Cypress.Commands.add('insertAppealAndCreateReply', appealReplyService.insertAppealAndCreateReply);
