#!/bin/bash

endpoint="dev-lpaquestionnaireserviceapi.azurewebsites.net"
cd "$1" || exit

if nc -dvzw1 $endpoint 443 2>/dev/null; then
    echo "Successfully connected to $endpoint";
    echo "Running tests....";

    if npm list --depth 1 -g cypress > /dev/null 2>&1; then
        echo "Cypress already installed.";
    else
        npm install;
    fi
    npm run test:e2e;
else
    echo "##vso[task.LogIssue type=error;]Could not connect to $endpoint";
    exit 1;
fi