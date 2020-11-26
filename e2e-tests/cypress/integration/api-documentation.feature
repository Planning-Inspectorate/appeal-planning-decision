Feature: The underlying API's are adequately documented
    Swagger documentation should describe our APIs
​
    Scenario: Horizon api is documented
        When I view the horizon-api documentation
        Then I should see //adddocuments
        And I should see //createcase

    Scenario: Appeals api is documented
        When I view the appeals-api documentation
        Then I should see GET //appeals
        And I should see POST //appeals
        And I should see GET //appeals//uuid
        And I should see DELETE //appeals//uuid
        And I should see PUT //appeals//uuid
        And I should see GET //local-planning-authorities
        And I should see GET //local-planning-authorities//id