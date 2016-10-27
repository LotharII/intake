# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Show Screening' do
  scenario 'showing existing participant' do
    existing_participant = {
      id: 1,
      first_name: 'Homer',
      last_name: 'Simpson',
      gender: 'male',
      ssn: '123-23-1234',
      date_of_birth: '1990-09-05'
    }
    existing_screening = {
      id: 4,
      created_at: '2016-10-24T15:14:22.923Z',
      ended_at: nil,
      incident_county: nil,
      incident_date: nil,
      location_type: nil,
      communication_method: nil,
      name: nil,
      report_narrative: nil,
      reference: '8KXNCK',
      response_time: nil,
      screening_decision: nil,
      started_at: nil,
      address: {
        street_address: nil,
        state: nil,
        city: nil,
        zip: nil,
        id: 8
      },
      participants: [existing_participant]
    }.with_indifferent_access

    faraday_stub = Faraday.new do |builder|
      builder.adapter :test do |stub|
        stub.get("/api/v1/screenings/#{existing_screening[:id]}") do |_|
          [200, {}, existing_screening]
        end
      end
    end
    allow(API).to receive(:connection).and_return(faraday_stub)

    visit screening_path(id: existing_screening[:id])

    within "#participants-card-#{existing_participant[:id]}" do
      within '.card-header' do
        expect(page).to have_content 'HOMER SIMPSON'
        expect(page).to have_link 'Edit participant'
        expect(page).to have_link 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_content('Homer')
        expect(page).to have_content('Simpson')
        expect(page).to have_content('Male')
        expect(page).to have_content('1990-09-05')
        expect(page).to have_content('123-23-1234')
      end
    end
  end
end
