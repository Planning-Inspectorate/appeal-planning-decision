# Write your PowerShell commands here.

param ($path)

#$path = "$(System.DefaultWorkingDirectory)/CypressTests/LPASubmissionsTests"
$endpoint = "https://dev-lpaquestionnaireserviceapi.azurewebsites.net" # make this a variable
Set-Location -Path ${path}

Test-Connection -ComputerName "${endpoint}" -Traceroute # this line is for debug only, can be commented out when confirmed working.

if(Test-Connection -ComputerName "${endpoint}" -Quiet) {
    Write-Host "Successfully connected to ${endpoint}"
    Write-Host "Running tests...."

    if(npm list --depth 1 -g cypress > /dev/null 2>&1) {
        Write-Host "Cypress already installed."
    } else {
        npm install
    }

    npm run test:e2e
} else {
    Write-Host  "##vso[task.LogIssue type=error;]Could not connect to ${endpoint}"
    exit 1;
}