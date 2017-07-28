import PropTypes from 'prop-types'
import React from 'react'
import AllegationsEditView from 'components/screenings/AllegationsEditView'
import AllegationsShowView from 'components/screenings/AllegationsShowView'

export default class AllegationsCardView extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      mode: props.mode,
    }

    this.onCancel = this.onCancel.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onCancel() {
    this.props.onCancel(['allegations'])
    this.setState({mode: 'show'})
  }

  onChange(victimId, perpetratorId, allegationTypes) {
    this.props.onChange(['allegations', victimId, perpetratorId], allegationTypes)
  }

  onEdit() {
    this.setState({mode: 'edit'})
  }

  onSave() {
    this.props.onSave(['allegations'])
    this.setState({mode: 'show'})
  }

  alertErrorMessage() {
    if (this.props.areAllegationsRequired) {
      if (this.props.allegations.some((allegation) => !allegation.get('allegation_types').isEmpty())) {
        return null
      } else {
        return 'Any report that is promoted for referral must include at least one allegation.'
      }
    } else {
      return null
    }
  }

  render() {
    const {mode} = this.state
    let allegations
    if (mode === 'edit') {
      allegations = this.props.allegations
    } else {
      allegations = this.props.allegations.filter((allegation) => allegation.get('id'))
    }
    const props = {
      alertErrorMessage: this.alertErrorMessage(),
      allegations: allegations,
      onCancel: this.onCancel,
      onEdit: this.onEdit,
      onSave: this.onSave,
      onChange: this.onChange,
    }

    const AllegationsView = (mode === 'show') ? AllegationsShowView : AllegationsEditView
    return <AllegationsView {...props} />
  }
}

AllegationsCardView.propTypes = {
  allegations: PropTypes.object.isRequired,
  areAllegationsRequired: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
