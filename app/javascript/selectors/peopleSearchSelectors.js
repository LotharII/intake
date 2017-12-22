import {Map, List} from 'immutable'
import {findByCode, findByCategory} from 'selectors'
import {createSelector} from 'reselect'

const getPeopleSearchSelector = (state) => state.get('peopleSearch')
export const getSearchTermValueSelector = (state) => (
  getPeopleSearchSelector(state).get('searchTerm')
)
export const getResultsTotalValueSelector = (state) => (
  getPeopleSearchSelector(state).get('total')
)

export const getResultLanguagesSelector = (state, result) => createSelector(
  (state) => state.get('languages'),
  (state) => (result.get('languages') || List()),
  (statusCodes, languages) => (
    languages
      .sort((item) => item.get('primary'))
      .map((language) => (
        findByCode(statusCodes.toJS(), language.get('id')).value)
      )

  )
)(state)

export const getIsSensitiveSelector = (result) => (result.get('sensitivity_indicator').toUpperCase() === 'S')
export const getIsSealedSelector = (result) => (result.get('sensitivity_indicator').toUpperCase() === 'R')

export const getResultRacesSelector = (state, result) => createSelector(
  (state) => state.get('ethnicityTypes'),
  (state) => (result.get('races') || List()),
  (state) => result.get('unable_to_determine_code'),
  (ethnicityTypes, races, unableToDetermineCode) => {
    if(!unableToDetermineCode || unableToDetermineCode === '')
      return races
        .map((race) => (Map({
          race: findByCategory(ethnicityTypes.toJS(), `race_${race.get('description')}`),
          race_detail: findByCode(ethnicityTypes.toJS(), race.get('id')).value
        })))
    else if(unableToDetermineCode === 'A')
      return List(['Abandoned'])
    else
      return List(['Unknown'])
  }
)(state)

export const getResultEthnicitiesSelector = (state, result) => createSelector(
  (state) => state.get('ethnicityTypes'),
  (state) => (result.get('ethnicity') || List()),
  (statusCodes, ethnicity) => (
    ethnicity
      .map((entry) => (
        findByCode(statusCodes.toJS(), entry.get('id')).value)
      )

  )
)(state)

export const getResultAddressSelector = (state, result) => createSelector(
  (state) => state.get('usStates'),
  (state) => result.getIn(['addresses', 0, 'city']),
  (state) => result.getIn(['addresses', 0, 'state_code']),
  (state) => result.getIn(['addresses', 0, 'zip']),
  (state) => result.getIn(['addresses', 0, 'street_number']),
  (state) => result.getIn(['addresses', 0, 'street_name']),
  (statusCodes, city, stateCode, zip, streetNumber, streetName) =>(
    Map({
      city: city,
      state: stateCode,
      zip: zip,
      type: '', // TODO: Implement as part of #INT-537
      street_address: `${streetNumber} ${streetName}`,
    })
  )
)(state)

const formatSSN = (ssn) => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
export const getPeopleResultsSelector = (state) => getPeopleSearchSelector(state)
  .get('results')
  .map((result) => {
    const address = result.getIn(['addresses', 0], null)
    const phoneNumber = result.getIn(['phone_numbers', 0], null)
    return Map({
      legacy_id: result.get('id'),
      firstName: result.getIn(['highlight', 'first_name'], result.get('first_name')),
      lastName: result.getIn(['highlight', 'last_name'], result.get('last_name')),
      middleName: result.get('middle_name'),
      nameSuffix: result.get('name_suffix'),
      legacyDescriptor: result.get('legacy_descriptor'),
      gender: result.get('gender'),
      languages: getResultLanguagesSelector(state, result),
      races: getResultRacesSelector(state, result),
      ethnicity: result.get('ethnicity'),
      dateOfBirth: result.getIn(['highlight', 'date_of_birth'], result.get('date_of_birth')),
      ssn: formatSSN(result.getIn(['highlight', 'ssn'], result.get('ssn'))),
      address: getResultAddressSelector(state, result),
      phoneNumber: phoneNumber && Map({
        number: phoneNumber.get('number'),
        type: phoneNumber.get('type'),
      }),
      isSensitive: getIsSensitiveSelector(result),
      isSealed: getIsSealedSelector(result),
    })
  })
