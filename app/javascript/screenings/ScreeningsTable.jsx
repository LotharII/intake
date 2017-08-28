import PropTypes from 'prop-types'
import React from 'react'
import SCREENING_DECISION from '../enums/ScreeningDecision'
import SCREENING_DECISION_OPTIONS from '../enums/ScreeningDecisionOptions'
import moment from 'moment'
import {Link} from 'react-router'

const ScreeningsTable = ({screenings}) => {
  const screeningStatus = (screening_decision, screening_decision_detail) => {
    if (['promote_to_referral', 'screen_out'].includes(screening_decision)) {
      const responseTimes = SCREENING_DECISION_OPTIONS[screening_decision]
      return responseTimes.values[screening_decision_detail]
    } else {
      return SCREENING_DECISION[screening_decision]
    }
  }
  return (
    <div className='table-responsive'>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th className='col-md-3' scope='col'>Screening Name</th>
            <th scope='col'>Type/Decision</th>
            <th scope='col'>Status</th>
            <th scope='col'>Assignee</th>
            <th scope='col'>Report Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {
            screenings.map(({id, name, screening_decision, screening_decision_detail, assignee, started_at, referral_id}) => {
              const screeningName = name ? name : id
              return (
                <tr key={id}>
                  <td><Link to={`/screenings/${id}`}>{screeningName}</Link></td>
                  <td>{screeningStatus(screening_decision, screening_decision_detail)}</td>
                  <td>&nbsp;</td>
                  <td>{assignee}</td>
                  <td>
                    {moment(started_at).format('L LT')} <br/>
                    <em className='text-muted'>({moment(started_at).fromNow()})</em>
                  </td>
                </tr>
                )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

ScreeningsTable.propTypes = {
  screenings: PropTypes.array,
}

ScreeningsTable.defaultProps = {
  screenings: [],
}
export default ScreeningsTable
