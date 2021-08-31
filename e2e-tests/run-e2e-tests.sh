
#$path = "$(System.DefaultWorkingDirectory)/CypressTests/AppealsServiceTests"
endpoint = "dev-formswebappserviceapi.azurewebsites.net" # make this a variable
cd $1

#Test-Connection -ComputerName "${endpoint}" -Traceroute # this line is for debug only, can be commented out when confirmed working.
response=$(curl -s $endpoint)

if [ $response == 'Found. Redirecting to /before-you-appeal' ]; then
    echo $response
    echo "Successfully connected to $endpoint"
    echo "Running tests...."

    if [ npm list --depth 1 -g cypress > /dev/null 2>&1 ]; then
        echo "Cypress already installed."
    else
        npm install;
    fi

    npm run test:e2e
else
    echo "##vso[task.LogIssue type=error;]Could not connect to ${endpoint}"
    exit 1;
fi
