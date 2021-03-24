Feature: uploadReportToReachDecision
  As a Beta LPA Planning Officer
  I want to provide the Planning Inspectorate with a copy of the Planning Officers Report
  So that this can form part of the Inspectors decision

Scenario: AC1 Access Upload the Planning Officers report question
Given LPA Planning Officer is within the LPA Questionnaire task list
When LPA Planning Officer selects the Upload the Planning Officers Report link
Then LPA Planning Officer is presented with the ability to upload the Planning Officers report

Scenario Outline: AC2 LPA Planning Officer successfully uploads file via upload button
Given Upload the Planning Officers report is requested
When a '<valid_file>' is successfully uploaded
Then progress is made to the Task List
And upload the Planning Officer's report subsection is shown as completed
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
Given Upload the Planning Officers report is requested
When a '<valid_file>' is uploaded via drag and drop
Then progress is made to the Task List
And upload the Planning Officer's report subsection is shown as completed
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
Given Upload the Planning Officers report is requested
When valid '<multiple_files>' are uploaded
Then progress is made to the Task List
And Upload the Planning Officers report is shown as completed
Examples:
|multiple_files|
|upload-file-valid.tiff, upload-file-valid.tif, upload-file-valid.png |
|upload-file-valid.pdf, upload-file-valid.jpg, upload-file-valid.jpeg |
|upload-file-valid.doc, upload-file-valid.docx |

Scenario: AC5 LPA Planning Officer does not upload a file and is provided with an error
Given Upload the Planning Officers report is requested
When no file has been uploaded
Then progress is halted with error message 'Upload the planning officer’s report or other documents and minutes'

Scenario Outline: AC6 LPA Planning Officer selects invalid file size
Given Upload the Planning Officers report is requested
When files of '<invalid_file_size>' have been selected
Then progress is halted with error message 'The file must be smaller than 15MB'
Examples:
|invalid_file_size|
|upload_file_large|

Scenario Outline: AC7 LPA Planning Officer selects Invalid file format
Given Upload the Planning Officers report is requested
When files of '<invalid_format>' have been selected
Then progress is halted with error message 'The file must be DOC, DOCX, PDF, TIF, JPG or PNG'
Examples:
|invalid_format|
|upload-file-invalid-wrong-type.csv|

Scenario: AC8 LPA Planning Officer selects to return to previous page
Given Upload the Planning Officers report is requested
When Back is then requested
Then the Task list is presented

Scenario: AC9 LPA Planning Officer deletes a file prior to save and continue
Given a file has been uploaded
When LPA Planning Officer deletes the file
Then the file is removed

Scenario: AC10 LPA Planning Officer deletes a file after save and continue
Given a file has been uploaded and confirmed
When LPA Planning Officer deletes the file
Then the file is removed

Scenario: AC11 LPA Planning Officer returns to the completed Upload the Planning Officers report question
Given The question "Upload the Planning Officers report" has been completed
When the Planning Officers report is requested
Then the information they previously entered is still populated

Scenario: AC12 Appeal details side panel
Given Upload the Planning Officers report is requested
Then the appeal details panel on the right hand side of the page can be viewed
