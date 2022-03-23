@e2e
Feature:  As an Appellant or Agent
          I want to upload New Plans and Drawings with my appeal
          So that the planning Inspectorate can have the necessary evidence to support my appeal

  Background:
    Given appellant has completed full appeal eligibility journey

  Scenario: 1 - Navigate from 'Do you have any new plans for drawings that support your appeal' page to 'New plans and drawings' page
    Given an Appellant or Agent is on the 'Do you have any new plans for drawings that support your appeal' page
    When they select 'Yes' and click on 'Continue' button
    Then the 'New plans and drawings' page is displayed

  Scenario: 2 - Appellant or Agent uploads valid file(s) and wants to add more file
    Given an Appellant or Agent is on the 'New plans and drawings' page
    When they add a valid file through 'Choose files' or 'drag and drop'
    And they click on 'Continue' button
    Then they are presented with the page 'Do you want to submit any new supporting documents with your appeal?'
    When they select the 'Back' link
    Then the 'New plans and drawings' page is displayed
    And they can see the files already uploaded
    And they can replace the files by selecting 'Choose files'

  Scenario Outline: 3. Appellant or Agent uploads a large file and an invalid file
    Given an Appellant or Agent is on the 'New plans and drawings' page
    And they have uploaded a file '<filename>'
    When they click on 'Continue' button
    Then the file '<filename>' '<errormessage>' is displayed
    Examples:
      | filename                                | errormessage                              |
      | upload-file-valid-15mb.png              | must be smaller than 15MB                 |
      | appeal-statement-invalid-wrong-type.mp3 | must be a DOC, DOCX, PDF, TIF, JPG or PNG |
      | appeal-statement-invalid-wrong-type.csv | must be a DOC, DOCX, PDF, TIF, JPG or PNG |
      |                                         | Select a plan or drawing                  |


  Scenario Outline: 4 - Appellant/Agent uploads some valid and some invalid files
    Given an Appellant or Agent is on the 'New plans and drawings' page
    When they upload one '<Valid file>' and one '<Invalid file>' through 'drag and drop' and click 'Continue'
    Then '<Invalid file>' '<error message>' is displayed
    And they will have to upload any valid files again
    Examples:
      | Valid file                 | Invalid file                            | error message                             |
      | appeal-statement-valid.tif | appeal-statement-invalid-wrong-type.mp3 | must be a DOC, DOCX, PDF, TIF, JPG or PNG |

  ### line 59, 2 invalid file error message is passing but this needs to be revisited
  Scenario Outline: 6 - Appellant or Agent uploads more than 1 invalid file
    Given an Appellant or Agent is on the 'New plans and drawings' page
    And is uploading two files '<InvalidFile1>' and '<InvalidFile2>'
    When they click on 'Continue' button
    Then '<InvalidFile1>' or '<InvalidFile2>' '<errormessage>' is displayed
    When InvalidFile1 is replaced with '<ValidFile>' and uploaded along with the '<InvalidFile2>'
    Then '<InvalidFile2>' '<errormessage>' is displayed
   Examples:
     | ValidFile             | InvalidFile1                    | InvalidFile2                       | errormessage                              |
     | upload-file-valid.tif | upload-file-invalid-too-big.png | upload-file-invalid-wrong-type.csv | must be a DOC, DOCX, PDF, TIF, JPG or PNG |

# Clam AV not in Full Planning
#  Scenario: 7 - Appellant or Agent uploads a file that contains a suspected virus
#    Given an Appellant or Agent wants to upload a file
#    When they try to upload a file(s) that contain a suspected virus
#    Then Error message '$filename.extension$ contains a virus' is displayed and the file is not uploaded

  Scenario: 8 - Navigate from 'Plans or drawings' page back to 'Do you have any new plans for drawings that support your appeal' page
    Given an Appellant or Agent is on the 'New plans and drawings' page
    When they click on the 'Back' link
    Then they are presented with the 'Plans and drawings' page

