const severityIndicators = {
    minor:'🟢 Minor',
    moderate:'🟡 Moderate',
    serious:'🟠 Serious',
    critical:'🔴 Critical'
}

function callback(violations){
    violations.forEach(violation => {
        const nodes = Cypress.$(violation.nodes.map(node => node.target).join(','))

        Cypress.log({
            name:`${severityIndicators[violation.impact]} A11Y`,
            consoleProps:() =>violation,
            $el:nodes,
            message: `[${violation.help}](${violation.helpUrl})`
        })

        violation.nodes.forEach(({ target })=>{
            Cypress.log({
                name:'🔧 Fix',
                consoleProps: () => violation,
                $el: Cypress.$(target.join(',')),
                message:target
            })
        })
    });
}

Cypress.Commands.add("checkPageA11y", (path) =>{
    cy.visit(path);
    cy.injectAxe();
    cy.checkA11y(null,null,callback);
})
