import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'

const IncidentInformationShow = ({incidentDate, incidentCounty, address, locationType}) => (
  <div className='card-body'>
    <div className='row'>
      <ShowField gridClassName='col-md-6' label='Incident Date'>
        {incidentDate}
      </ShowField>
    </div>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='Address'>
        {address.streetAddress}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='City'>
        {address.city}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Incident County'>
        {incidentCounty}
      </ShowField>
    </div>
    <div className='row'>
      <ShowField gridClassName='col-md-4' label='State'>
        {address.state}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Zip'>
        {address.zip}
      </ShowField>
      <ShowField gridClassName='col-md-4' label='Location Type'>
        {locationType}
      </ShowField>
    </div>
  </div>
)

IncidentInformationShow.propTypes = {
  incidentDate: PropTypes.string,
  incidentCounty: PropTypes.string,
  address: PropTypes.shape({
    streetAddress: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
  }),
  locationType: PropTypes.string,
}

IncidentInformationShow.defaultProps = {
  address: {
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
  }
}

export default IncidentInformationShow
