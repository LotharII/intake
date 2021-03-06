# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'
feature 'searching a participant in autocompleter' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  let(:date_of_birth) { 15.years.ago.to_date }
  before do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)
    visit edit_screening_path(id: existing_screening.id)
  end

  context 'search for a person' do
    scenario 'search result contains person information' do
      languages = [
        { name: 'French', primary: true },
        { name: 'Italian' }
      ]
      search_response = SearchResultBuilder.build do |builder|
        builder.with_first_name('Marge')
        builder.with_middle_name('Jacqueline')
        builder.with_last_name('Simpson')
        builder.with_name_suffix('md')
        builder.with_gender('female')
        builder.with_dob(date_of_birth)
        builder.with_ssn('123231234')
        builder.with_languages(languages)
        builder.with_phone_number(number: '971-287-6774', type: 'Home')
        builder.with_address(
          legacy_id: '',
          legacy_source_table: '',
          street_number: 123,
          street_name: 'Fake St',
          state_code: 'NY',
          city: 'Springfield',
          zip: '11222',
          type: ''
        )
        builder.with_race_and_ethinicity(
          hispanic_origin_code: 'Y',
          race_codes: [
            { description: 'White - European*' },
            { description: 'Alaskan Native*' }
          ],
          hispanic_codes: [
            { description: 'Central American' }
          ],
          hispanic_unable_to_determine_code: ''
        )
        builder.with_sensitivity
      end
      stub_person_search('Ma', search_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to have_content date_of_birth.strftime('%-m/%-d/%Y')
        expect(page).to have_content '15 yrs old'
        expect(page).to have_content 'Female, White, American Indian or Alaska Native'
        expect(page).to have_content 'Hispanic/Latino'
        expect(page).to have_content 'Language'
        expect(page).to have_content 'French (Primary), Italian'
        expect(page).to have_content 'Home'
        expect(page).to have_content '971-287-6774'
        expect(page).to have_content 'SSN'
        expect(page).to have_content '123-23-1234'
        expect(page).to have_content '123 Fake St, Springfield, NY 11222'
        expect(page).to have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'search results format the SSN' do
      search_response = SearchResultBuilder.build do |builder|
        builder.with_first_name('Marge')
        builder.with_ssn('123456789')
      end
      stub_person_search('Ma', search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end
      within '.react-autosuggest__suggestions-list' do
        expect(page).to have_content '123-45-6789'
      end
    end

    scenario 'results include information about the legacy source information for a person' do
      search_response = SearchResultBuilder.build do |builder|
        builder.with_first_name('Marge')
        builder.with_legacy_descriptor(
          legacy_ui_id: '123-456-789',
          legacy_table_description: 'Client'
        )
      end
      stub_person_search('Ma', search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within '.react-autosuggest__suggestions-list' do
        expect(page).to have_content 'Client ID 123-456-789 in CWS-CMS'
      end
    end

    scenario 'person without phone_numbers' do
      search_response = SearchResultBuilder.build do |builder|
        builder.with_first_name('Marge')
        builder.with_middle_name('Jacqueline')
        builder.with_last_name('Simpson')
        builder.with_name_suffix('md')
        builder.with_phone_number({})
      end
      stub_person_search('Ma', search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end
      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to_not have_css 'fa-phone'
      end
    end

    scenario 'person without addresses' do
      search_response = SearchResultBuilder.build do |builder|
        builder.with_first_name('Marge')
        builder.with_middle_name('Jacqueline')
        builder.with_last_name('Simpson')
        builder.with_name_suffix('md')
        builder.with_address({})
      end
      stub_person_search('Ma', search_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to_not have_css 'fa-map-marker'
      end
    end

    scenario 'person who is neither sensitive nor sealed' do
      search_response = SearchResultBuilder.build do |builder|
        builder.with_first_name('Marge')
        builder.without_sealed_or_sensitive
      end
      stub_person_search('Ma', search_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge' do
        expect(page).to_not have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'person who is sensitive' do
      search_response = SearchResultBuilder.build do |builder|
        builder.with_first_name('Marge')
        builder.with_sensitivity
      end
      stub_person_search('Ma', search_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge' do
        expect(page).to have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'person who is sealed' do
      search_response = SearchResultBuilder.build do |builder|
        builder.with_first_name('Marge')
        builder.with_sealed
      end
      stub_person_search('Ma', search_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge' do
        expect(page).to_not have_content 'Sensitive'
        expect(page).to have_content 'Sealed'
      end
    end

    scenario 'search displays no results when none are returned' do
      no_search_results = {
        hits: {
          total: 0,
          hits: []
        }
      }
      stub_person_search('No', no_search_results)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'No', skip_select: true
        expect(page).to have_content 'No results were found for "No"'
      end
    end

    scenario 'search displays the number of results in results header' do
      search_results = {
        hits: {
          total: 25,
          hits: [{
            _source: {
              race_ethnicity: {},
              addresses: [],
              gender: 'male',
              languages: [],
              date_of_birth: '1991-08-08',
              legacy_descriptor: {},
              last_name: 'Person',
              middle_name: 'Middle name',
              ssn: '',
              phone_numbers: [],
              id: 'Ca10L2205I',
              first_name: 'Random',
              sensitivity_indicator: 'N',
              sensitive: false,
              sealed: false,
              races: [],
              ethnicity: {},
              legacy_id: ''
            }
          }]
        }
      }
      stub_person_search('So', search_results)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'So', skip_select: true
        expect(page).to have_content 'Showing 1-25 of 25 results for "So"'
      end
    end
  end
end
