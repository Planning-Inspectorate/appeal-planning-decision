Feature: Delete files from Document Service

Scenario: File is deleted from the document store

Given a request is made to delete a file
When delete request has been sent
Then the file is removed from the document service. 

Scenario: Document does not exist

Given a file does not exist 
When delete request has been sent 
Then an error response is received