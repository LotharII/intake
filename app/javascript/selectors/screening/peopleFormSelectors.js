import selectOptions from 'utils/selectHelper'
import APPROXIMATE_AGE_UNITS from 'enums/ApproximateAgeUnits'
import Genders from 'enums/Genders'
import LANGUAGES from 'enums/Languages'
import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
import {ROLE_TYPE_NON_REPORTER, ROLE_TYPE_REPORTER} from 'enums/RoleType'
import {combineCompact} from 'utils/validator'

const VALID_SSN_LENGTH = 9
const ONE = 1
const formatEnums = (enumObject) =>
  Object.keys(enumObject).map((item) => ({label: enumObject[item], value: item}))

export const getPeopleSelector = (state) => state.get('peopleForm')
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import PHONE_NUMBER_TYPE from 'enums/PhoneNumberType'
import ADDRESS_TYPE from 'enums/AddressType'
import US_STATE from 'enums/USState'
import {RACE_DETAILS} from 'enums/Races'
import {ETHNICITY_DETAILS} from 'enums/Ethnicity'

export const getPeopleWithEditsSelector = createSelector(
  getPeopleSelector,
  getScreeningIdValueSelector,
  (people, screeningId) => people.map((person, personId) => {
    const isAgeDisabled = Boolean(person.getIn(['date_of_birth', 'value']))
    const hispanic_latino_origin = person.getIn(['ethnicity', 'hispanic_latino_origin', 'value'])
    let ethnicity_detail
    if (hispanic_latino_origin === 'Yes') {
      ethnicity_detail = person.getIn(['ethnicity', 'ethnicity_detail', 'value'])
    } else {
      ethnicity_detail = []
    }
    return fromJS({
      screening_id: screeningId,
      id: personId,
      approximate_age: isAgeDisabled ? null : person.getIn(['approximate_age', 'value']),
      approximate_age_units: isAgeDisabled ? null : person.getIn(['approximate_age_units', 'value']),
      date_of_birth: person.getIn(['date_of_birth', 'value']),
      first_name: person.getIn(['first_name', 'value']),
      gender: person.getIn(['gender', 'value']),
      languages: person.getIn(['languages', 'value']),
      legacy_descriptor: person.getIn(['legacy_descriptor', 'value']),
      middle_name: person.getIn(['middle_name', 'value']),
      last_name: person.getIn(['last_name', 'value']),
      name_suffix: person.getIn(['name_suffix', 'value']),
      phone_numbers: person.get('phone_numbers', List()).map((phoneNumber) => Map({
        id: phoneNumber.get('id'),
        number: phoneNumber.getIn(['number', 'value']),
        type: phoneNumber.getIn(['type', 'value']),
      })),
      addresses: person.get('addresses', List()).map((address) => Map({
        id: address.get('id'),
        street_address: address.getIn(['street', 'value']),
        city: address.getIn(['city', 'value']),
        state: address.getIn(['state', 'value']),
        zip: address.getIn(['zip', 'value']),
        type: address.getIn(['type', 'value']),
      })),
      roles: person.getIn(['roles', 'value']),
      ssn: person.getIn(['ssn', 'value']),
      sensitive: person.getIn(['sensitive', 'value']),
      sealed: person.getIn(['sealed', 'value']),
      ethnicity: {hispanic_latino_origin, ethnicity_detail},
      races: person.get('races', Map()).reduce((races, raceValue, raceKey) => {
        const raceDetails = person.getIn(['race_details', raceKey, 'value'], null)
        if (raceValue.get('value')) {
          return [...races, {race: raceKey, race_detail: raceDetails}]
        } else {
          return races
        }
      }, []),
    })
  })
)
export const getPhoneNumberTypeOptions = () => fromJS(PHONE_NUMBER_TYPE.map((type) => ({value: type, label: type})))
export const getPersonPhoneNumbersSelector = (state, personId) => (
  state.get('peopleForm', Map()).get(personId).get('phone_numbers', List()).map((phoneNumber) => (
    Map({
      number: phoneNumber.getIn(['number', 'value']) || '',
      type: phoneNumber.getIn(['type', 'value']) || '',
    })
  ))
)

export const getFilteredPersonRolesSelector = (state, personId) => {
  const selectedRoles = state.getIn(['peopleForm', personId, 'roles', 'value'], List())
  const hasReporterRole = selectedRoles.some((role) => ROLE_TYPE_REPORTER.includes(role))
  return fromJS([
    ...ROLE_TYPE_NON_REPORTER.map((value) => ({label: value, value, disabled: false})),
    ...ROLE_TYPE_REPORTER.map((value) => ({label: value, value, disabled: hasReporterRole})),
  ])
}

export const getAddressTypeOptionsSelector = () => fromJS(ADDRESS_TYPE.map((type) => ({value: type, label: type})))
export const getStateOptionsSelector = () => fromJS(US_STATE.map(({code, name}) => ({value: code, label: name})))

export const getPersonAddressesSelector = (state, personId) => (
  state.get('peopleForm', Map()).get(personId).get('addresses', List()).map((address) => (
    Map({
      street: address.getIn(['street', 'value']) || '',
      city: address.getIn(['city', 'value']) || '',
      state: address.getIn(['state', 'value']) || '',
      zip: address.getIn(['zip', 'value']) || '',
      type: address.getIn(['type', 'value']) || '',
    })
  ))
)

export const getIsApproximateAgeDisabledSelector = (state, personId) => (
  Boolean(state.getIn(['peopleForm', personId, 'date_of_birth', 'value']))
)

export const getApproximateAgeUnitOptionsSelector = () => fromJS(formatEnums(APPROXIMATE_AGE_UNITS))
export const getLanguageOptionsSelector = () => fromJS(selectOptions(LANGUAGES))
export const getGenderOptionsSelector = () => fromJS(formatEnums(Genders))

export const getPersonDemographicsSelector = (state, personId) => {
  const person = state.getIn(['peopleForm', personId], Map())
  return fromJS({
    approximateAge: person.getIn(['approximate_age', 'value']) || '',
    approximateAgeUnit: person.getIn(['approximate_age_units', 'value']) || 'years',
    dateOfBirth: person.getIn(['date_of_birth', 'value']) || '',
    gender: person.getIn(['gender', 'value']) || '',
    languages: person.getIn(['languages', 'value']) || [],
  })
}

export const getPersonRacesSelector = (state, personId) => {
  const personRaces = state.getIn(['peopleForm', personId, 'races'])
  return Object.keys(RACE_DETAILS).reduce(
    (races, race) => races.set(race, personRaces.getIn([race, 'value'], false)),
    Map()
  )
}
export const getPersonRaceDetailsSelector = (state, personId) => {
  const personRaces = state.getIn(['peopleForm', personId, 'race_details'])
  return Object.keys(RACE_DETAILS).reduce(
    (races, race) => races.set(race, personRaces.getIn([race, 'value'], '')),
    Map()
  )
}

export const getAreEthnicityFieldsDisabledForPersonSelector = (state, personId) => (
  Boolean(state.getIn(['peopleForm', personId, 'ethnicity', 'hispanic_latino_origin', 'value']))
)

export const getPersonHispanicLatinoOriginValueSelector = (state, personId) => (
  state.getIn(['peopleForm', personId, 'ethnicity', 'hispanic_latino_origin', 'value'])
)

export const getEthnicityDetailOptionsSelector = () => (
  fromJS(ETHNICITY_DETAILS.map((detail) => ({value: detail, label: detail})))
)

export const getPersonEthnicityDetaiValueSelector = (state, personId) => (
  state.getIn(['peopleForm', personId, 'ethnicity', 'ethnicity_detail', 'value', 0])
)
export const getIsRaceIndeterminateValueSelector = (state, personId) => {
  const isUnknown =
    state.getIn(['peopleForm', personId, 'races', 'Unknown', 'value'])
  const isAbandoned =
    state.getIn(['peopleForm', personId, 'races', 'Abandoned', 'value'])
  const isDeclinedToAnswer =
    state.getIn(['peopleForm', personId, 'races', 'Declined to answer', 'value'])

  return Boolean(isUnknown || isAbandoned || isDeclinedToAnswer)
}
export const getErrorsForPersonSelector = (state, personId) => {
  const ssn = state.getIn(['peopleForm', personId, 'ssn', 'value']) || ''
  return fromJS({
    ssn: combineCompact(
      () => {
        const ssnWithoutHyphens = ssn.replace('-', '')
        if (ssnWithoutHyphens.length > ONE && ssnWithoutHyphens < VALID_SSN_LENGTH) {
          return 'Social security number must be 9 digits long'
        } else {
          return undefined
        }
      },
      () => {
        if (ssn && ssn.startsWith('9')) {
          return 'Social security number cannot begin with 9'
        } else {
          return undefined
        }
      },
    )
  })
}
        // if (ssn) {
          // const ssnSplits = ssn.split('-')
          // if (ssnSplits.length === ONE && ssn.length < SSN_LENGTH) {
            // return 'Social security number must be 9 digits long.'
          // }
          // if (ssn.startsWith('666')) {
            // return 'Social security number cannot begin with 666.'
          // }
          // if (ssn.startsWith('9')) {
            // return 'Social security number cannot begin with 9.'
          // }
          // if (ssnSplits.length > ONE) {
            // if (ssn.length < SSN_LENGTH_WITH_DASHES) {
              // return 'Social security number must be 11 digits long.'
            // }
            // let validSSN = true
            // for (let splitIndex = 0; splitIndex < ssnSplits.length; splitIndex++) {
              // if (validSSN) {
                // const ssnSplit = ssnSplits[splitIndex]
                // let zeroCount = 0
                // for (let index = 0; index < ssnSplit.length; index++) {
                  // if (ssnSplit.charAt(index) === '0') {
                    // zeroCount++
                  // }
                // }
                // if (zeroCount === (ssnSplit.length)) {
                  // validSSN = false
                // }
              // }
            // }
            // if (!validSSN) {
              // return 'Social security number cannot contain all 0s in a group.'
            // }
          // }
        // }
        // return undefined
      // }

export const getTouchedFieldsForPersonSelector = (state, personId) => {
  const peopleForm = state.getIn(['peopleForm', personId], Map())
  return peopleForm.filter((field) => field.get('touched')).keySeq().toList()
}

export const getVisibleErrorsForPersonSelector = (state, personId) => {
  const touchedFields = getTouchedFieldsForPersonSelector(state, personId)
  const errors = getErrorsForPersonSelector(state, personId)
  return errors.reduce(
    (filteredErrors, fieldErrors, field) => {
      if (touchedFields.includes(field)) {
        return filteredErrors.set(field, fieldErrors)
      } else {
        return filteredErrors.set(field, List())
      }
    },
    Map()
  )
}
