Feature: uploadThePlansToReachDecision
  As a beta LPA Planning Officer
  I want to upload the plans which were used to reach the LPA decision
  So that they can form part of the evidence on which the Inspector makes a decision

Scenario: AC1 LPA Planning Officer navigations to 'Upload the plans used to reach the decision' question
Given LPA Planning Officer is reviewing their LPA Questionnaire task list
When LPA Planning Officer chooses to upload plans used to reach the decision
Then LPA Planning Officer is presented with the ability to upload plans

Scenario Outline: AC2 LPA Planning Officer successfully uploads file via upload button
Given Upload the plans used to reach the decision question is requested
When a '<valid_file>' is successfully uploaded
Then progress is made to the Task List
And Upload the plans used to reach the decision subsection is shown as completed
Examples:
|valid_file|
|upload-file-valid.tiff|
|upload-file-valid.tif|
|upload-file-valid.png|
|upload-file-valid.pdf|
|upload-file-valid.jpg|
|upload-file-valid.jpeg|
|upload-file-valid.doc|
|upload-file-valid.docx|

Scenario Outline: AC3 LPA Planning Officer successfully uploads file via Drag and Drop
Given Upload the plans used to reach the decision question is requested
When a '<valid_file>' is uploaded via drag and drop
Then progress is made to the Task List
And Upload the plans used to reach the decision subsection is shown as completed
Examples:
|valid_file|
|upload-file-valid.tiff|
|upload-file-valid.tif|
|upload-file-valid.png|
|upload-file-valid.pdf|
|upload-file-valid.jpg|
|upload-file-valid.jpeg|
|upload-file-valid.doc|
|upload-file-valid.docx|

Scenario Outline: AC4 LPA Planning Officer successfully uploads multiple files
Given Upload the plans used to reach the decision question is requested
When valid '<multiple_files>' are uploaded
Then progress is made to the Task List
And Upload the plans used to reach the decision subsection is shown as completed
Examples:
|multiple_files|
|upload-file-valid.tiff, upload-file-valid.tif, upload-file-valid.png |
|upload-file-valid.pdf, upload-file-valid.jpg, upload-file-valid.jpeg |
|upload-file-valid.doc, upload-file-valid.docx |

Scenario: AC5 LPA Planning Officer does not upload a file and is provided with an error.
Given Upload the plans used to reach the decision question is requested
When no file has been uploaded
Then progress is halted with error message 'Upload plans used to reach the decision'

Scenario Outline: AC6 LPA Planning Officer selects invalid file size
Given Upload the plans used to reach the decision question is requested
When files of '<invalid_file_size>' have been selected
Then progress is halted with error message 'The file must smaller than 15MB'
Examples:
|invalid_file_size|
|upload_file_large|

Scenario Outline: AC7 LPA Planning Officer selects Invalid file format
Given Upload the plans used to reach the decision question is requested
When files of '<invalid_format>' have been selected
Then progress is halted with error message 'The file must be DOC, DOCX, PDF, TIF, JPG or PNG'
Examples:
|invalid_format|
|upload-file-invalid-wrong-type.csv|

Scenario: AC8 LPA Planning Officer selects to return to previous page
Given Upload the plans used to reach the decision question is requested
When Back is then requested
Then the Task list is presented

Scenario: AC9  LPA Planning Officer deletes a file prior to save and continue
Given a file has been uploaded
When LPA Planning Officer deletes the file
Then the file is removed

Scenario: AC10  LPA Planning Officer deletes a file after save and continue
Given a file has been uploaded and confirmed
When LPA Planning Officer deletes the file
Then the file is removed

Scenario: AC11 LPA Planning Officer returns to the completed Upload the plans used to reach the decision question
Given The question 'Upload the plans used to reach the decision' has been completed
When the plans used to reach the decision question is requested
Then the information they previously entered is still populated

Scenario: AC12 Appeal details side panel
Given Upload the plans used to reach the decision question is requested
Then the appeal details panel on the right hand side of the page can be viewed
