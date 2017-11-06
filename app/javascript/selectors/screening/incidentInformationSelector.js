import COUNTIES from 'enums/Counties'
import US_STATE from 'enums/USState'
import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import dateFormatter from 'utils/dateFormatter'

export const getScreeningSelector = (state) => state.get('screening', Map())

export const getIncidentDateSelector = createSelector(
  getScreeningSelector,
  (screening) => screening.get('incident_date', '')
)

export const getIncidentCountySelector = createSelector(
  getScreeningSelector,
  (screening) => COUNTIES[screening.get('incident_county')] || ''
)

export const getAddressSelector = createSelector(
  getScreeningSelector,
  (store) => US_STATE.find((usState) => usState.code === store.getIn(['screening', 'address', 'state'])),
  (screening, usState) => Map({
    city: screening.getIn(['address', 'city'], ''),
    streetAddress: screening.getIn(['address', 'street_address'], ''),
    state: usState ? usState.name : '',
    zip: screening.getIn(['address', 'zip'], ''),
  })
)

export const getLocationTypeSelector = createSelector(
  getScreeningSelector,
  (screening) => screening.get('location_type', '')
)
