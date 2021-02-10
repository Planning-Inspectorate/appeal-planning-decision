@wip
Feature: Eligibility - Appeal Householder Planning Permission Question
 Prospective appellant states whether they are appealing against a householder planning permission decision
 So that the system can confirm whether their appeal is eligible to use the private beta service.

 Scenario: AC1. Navigation to the householder question page
   Given access to the appeals service eligibility is available
   When the appeal service eligibility is accessed
   Then the appeals householder planning permission question is presented

 Scenario: AC2. Prospective appellant makes no selection and is provided an error
   Given the appeals householder planning permission question is requested
   When no confirmation is provided for householder planning permission question
   Then progress is halted with a message that a householder planning permission is required

 Scenario: AC3. Prospective appellant selects yes and proceeds through eligibility checker
   Given the appeals householder planning permission question is requested
   When confirmation is provided for householder planning permission question
   Then progress is made to the eligibility decision date question

 Scenario: AC4. Prospective appellant selects no and is taken to kick-out page
   Given the appeals householder planning permission question is requested
   When confirmation is not provided for householder planning permission question
   Then the user is navigated to the 'This service is only for householder planning appeals' page

 Scenario: AC4. Prospective appellant is on the kick-out page and can see link to ACP
   Given the appeals householder planning permission question is requested
   When confirmation is not provided for householder planning permission question
   Then access is available to ACP service

 Scenario: Householder planning permission help text
   Given the appeals householder planning permission question is requested
   When the 'What is householder planning permission' additional information is accessed
   Then the householder planning permission additional information is presented
