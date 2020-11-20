# Cypress support

This is where we can monkey-patch new commands into cypress to customise it for our world

//TODO document use of cypress-ntlm-auth/dist/commands

https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax

Examples that were initially provided as cypress installed, but we have trimmed out to keep the actual code clean...
```
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
```
