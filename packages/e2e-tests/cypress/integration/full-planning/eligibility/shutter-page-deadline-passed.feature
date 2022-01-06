Feature:Shutter page - Deadline passed
  As an appellant
  I am notified that I cannot make an appeal when I enter an out of time date
  so that I am not able to proceed further with my application

  Scenario: AC01 - Shutter page
    Given an appellant is on the shutter page for date passed for appeal
    Then appellant is displayed details for  out of time shutter page
