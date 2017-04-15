import React from 'react'

export default class HistoryCard extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.actions.fetchHistoryOfInvolvements()
  }

  render() {
    return (
      <div className='card show double-gap-top' id='history-card'>
        <div className='card-header'>
          <span>History</span>
        </div>
        <div className='card-body no-pad-top'>
          <div className='row'>
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Type/Status</th>
                    <th scope='col'>County/Office</th>
                    <th scope='col'>People and Roles</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

HistoryCard.propTypes = {
  actions: React.PropTypes.object.isRequired,
}
