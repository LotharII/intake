# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Person Information Validations' do
  let(:invalid_ssn) { nil }
  let(:valid_ssn) { '123-45-6789' }
  let(:person) { FactoryGirl.create :participant, ssn: invalid_ssn }
  let(:screening) { FactoryGirl.create :screening, participants: [person] }
  let(:person_name) { "#{person.first_name} #{person.last_name}" }

  before do
    stub_and_visit_edit_screening(screening)
  end

  context 'ssn has all zeros in the first group' do
    let(:invalid_ssn) { '000-12-3456' }
    let(:error_message) { 'Social security number cannot contain all 0s in a group.' }

    scenario 'error is displayed until user enters a valid ssn' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person_name: person_name,
        invalid_person: person,
        error_message: error_message,
        person_updates: { ssn: valid_ssn }
      ) do
        within '.card', text: person_name do
          fill_in 'Social security number', with: valid_ssn
        end
      end
    end
  end

  context 'ssn begins with a 9' do
    let(:invalid_ssn) { '987-65-4321' }
    let(:error_message) { 'Social security number cannot begin with 9' }

    scenario 'error is displayed until user enters a valid ssn' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person_name: person_name,
        invalid_person: person,
        error_message: error_message,
        person_updates: { ssn: valid_ssn }
      ) do
        within '.card', text: person_name do
          fill_in 'Social security number', with: valid_ssn
        end
      end
    end
  end
end
