Feature: Simple user flow

  Description: The purpose of these tests is to cover a few scenarios for testing REST API https://gorest.co.in/

  @working
  Scenario: Create new user
    Given user with email "test_user_01@gmal.com" does not exist
    When request to create a user is sent with the following properties:
      | name   | Test User 01           |
      | email  | test_user_01@gmail.com |
      | gender | Male                   |
      | status | Active                 |
    Then response code is 201
    And user with email "test_user_01@gmail.com" exists

  @working
  Scenario: Create user that already exists
    Given user with email "test_user_01@gmail.com" exists
    When request to create a user is sent with the following properties:
      | name   | Test User 01           |
      | email  | test_user_01@gmail.com |
      | gender | Male                   |
      | status | Active                 |
    Then response code is 422
    And new user with email "test_user_01@gmail.com" is not created

  @working
  Scenario: Update user details
    Given user with email "test_user_01@gmail.com" exists
    And user with email "test_user_01@gmail.com" has the following properties:
      | gender | Male   |
      | status | Active |
    When request to update user with email "test_user_01@gmail.com" is sent with the following properties:
      | gender | Female   |
      | status | Inactive |
    Then response code is 200
    And user with email "test_user_01@gmail.com" has the following properties:
      | gender | Female   |
      | status | Inactive |


  Scenario: Create user post
    Given user with email "test_user_01@gmail.com" exists
    When request to create user post for user with email "test_user_01@gmail.com" is sent with the following properties:
      | title | User post title       |
      | body  | User post description |
    Then response code is 201
    And post for user with email "test_user_01@gmail.com" exists


  Scenario: Delete user
    Given user with email "test_user_01@gmail.com" exists
    When request to delete user with email "test_user_01@gmail.com" is sent
    Then response code is 204
    And user with email "test_user_01@gmail.com" does not exist

