Feature: The underlying API's are adequately documented
    Swagger documentation should describe our APIs
​
    Scenario: Horizon api is documented
        When I view the horizon-api documentation
        Then I should see /adddocuments
        And I should see /createcase