Feature: Todo Tasks Management
  As a user
  I want to manage my tasks
  So that I can organize my daily work

  Background:
    Given I visit the Todo application

  Scenario: Initial application display
    Then I should see 2 default tasks
    And the first task should be "Pay electric bill"
    And the last task should be "Walk the dog" 