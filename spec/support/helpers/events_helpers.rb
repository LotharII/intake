# frozen_string_literal: true

module EventsHelpers
  def focused_native_element
    evaluate_script('document.activeElement')
  end

  def blur_field(selector = nil)
    if selector
      find_field(selector).send_keys :tab
    else
      page.document.find('body').click
    end
  end
end

RSpec.configure do |config|
  config.include EventsHelpers
end
