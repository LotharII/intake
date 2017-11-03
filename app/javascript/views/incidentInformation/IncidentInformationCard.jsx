import PropTypes from 'prop-types'
import React from 'react'
import ScreeningCardHeader from 'screenings/ScreeningCardHeader'
import IncidentInformationShow from 'views/incidentInformation/IncidentInformationShow'
import IncidentInformationEdit from 'views/incidentInformation/IncidentInformationEdit'

const IncidentInformationCard = ({mode, editable}) => (
  <div className={`card ${mode} double-gap-top`} id='incident-information-card'>
    <ScreeningCardHeader
      title='Incident Information'
      showEdit={editable && mode === 'show'}
    />
    { mode === 'show' ? <IncidentInformationShow /> : <IncidentInformationEdit /> }
  </div>
)


IncidentInformationCard.propTypes = {
  editable: PropTypes.boolean,
  mode: PropTypes.string,
}

export default IncidentInformationCard
