import {connect} from 'react-redux'
import {
  getIncidentDateSelector,
  getIncidentCountySelector,
  getAddressSelector,
  getLocationTypeSelector,
} from 'selectors/screening/incidentInformationSelector'
import IncidentInformationShow from 'views/incidentInformation/IncidentInformationShow'

const mapStateToProps = (state, ownProps) => ({
  errors: ownProps.errors,
  incidentDate: getIncidentDateSelector(state),
  incidentCounty: getIncidentCountySelector(state),
  incidentAddress: getAddressSelector(state).toJS(),
  incidentType: getLocationTypeSelector
})

export default connect(mapStateToProps)(IncidentInformationShow)
