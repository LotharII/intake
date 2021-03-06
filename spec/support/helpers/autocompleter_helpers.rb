# frozen_string_literal: true

require 'timeout'
require 'support/helpers/keyboard_helper'

module AutocompleterHelpers
  include KeyboardHelper
  RESULTS_CONTAINER = '.react-autosuggest__suggestions-container ul'

  def fill_in_autocompleter(
    locator,
    with:,
    select_option_with: nil,
    skip_select: false,
    split: false
  )
    select_option_with ||= with
    populate_autocompleter_with_options(locator, with, split)
    click_autocompleter_result(with, select_option_with) unless skip_select
  end

  def populate_autocompleter_with_options(locator, value, split)
    unless /selenium|accessible/.match?(Capybara.current_driver.to_s)
      raise 'You need to tag your test with @javascript to use this step'
    end
    if split
      value.split('').each do |character|
        find_field(locator).native.send_keys(character)
        sleep 0.41
      end
    else
      fill_in locator, with: value
      sleep 0.5
    end
  end

  def click_autocompleter_result(value, result_should_contain)
    wait_for_result_to_appear(value, result_should_contain)
    press_key :down
  rescue Timeout::Error
    raise "Unable to find autocompleter result with text:\n#{value}"
  rescue Selenium::WebDriver::Error::StaleElementReferenceError
    sleep(0.1)
    retry
  end

  def whole_page
    page.find(:xpath, '//body')
  end

  def wait_for_result_to_appear(value, result_should_contain = nil)
    Timeout.timeout(2.0 * Capybara.default_max_wait_time) do
      sleep(0.1) until page.first(
        RESULTS_CONTAINER.to_s,
        visible: true,
        text: result_should_contain || value
      )
    end
  end
end

RSpec.configure do |config|
  config.include AutocompleterHelpers, type: :feature
end
