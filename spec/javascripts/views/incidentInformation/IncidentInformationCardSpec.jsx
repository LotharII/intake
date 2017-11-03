import React from 'react'
import {shallow} from 'enzyme'
import IncidentInformationCard from 'views/incidentInformation/IncidentInformationCard'
import IncidentInformationShow from 'views/incidentInformation/IncidentInformationShow'
import IncidentInformationEdit from 'views/incidentInformation/IncidentInformationEdit'

describe('IncidentInformationCard', () => {
  const renderIncidentInformationCard = (props) => (
    shallow(<IncidentInformationCard {...props}/>)
  )

  it('renders a ScreeningCardHeader with the proper title', () => {
    const component = renderIncidentInformationCard()
    expect(component.find('ScreeningCardHeader').exists()).toEqual(true)
  })

  it('renders the show view if the mode is show', () => {
    const component = renderIncidentInformationCard({
      mode: 'show'
    })
    expect(component.find(IncidentInformationShow).exists()).toEqual(true)
  })

  it('renders the edit view if the mode is edit', () => {
    const component = renderIncidentInformationCard({
      mode: 'edit'
    })
    expect(component.find(IncidentInformationEdit).exists()).toEqual(true)
  })
})
