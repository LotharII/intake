# frozen_string_literal: true

# PersonSearchRepository is a service class responsible for search of a person
# resource via the API
class PersonSearchRepository
  class << self
    def search(security_token, search_term)
      response = DoraAPI.make_api_call(
        security_token,
        Rails.application.routes.url_helpers.dora_people_light_index_path,
        :post,
        PersonSearchQueryBuilder.new(search_term).build
      )
      search_body = response.body
      raise search_body unless response.status == 200
      search_body
    end
  end
end
