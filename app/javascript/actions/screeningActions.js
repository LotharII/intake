import {get, post, destroy, put} from 'utils/http'
import {
  CREATE_SCREENING,
  CREATE_SCREENING_SUCCESS,
  CREATE_SCREENING_FAILURE,
  UPDATE_SCREENING_SUCCESS,
  FETCH_SCREENING_SUCCESS,
  CREATE_PARTICIPANT_SUCCESS,
  DELETE_PARTICIPANT_SUCCESS,
  UPDATE_PARTICIPANT_SUCCESS,
  UPDATE_PARTICIPANT_FAILURE,
  FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS,
  FETCH_RELATIONSHIPS_SUCCESS,
  SUBMIT_SCREENING_SUCCESS,
  SUBMIT_SCREENING_FAILURE,
} from 'actions/actionTypes'

export function createScreeningSuccess(screening) {
  return {type: CREATE_SCREENING_SUCCESS, screening}
}

export function createScreeningFailure(error) {
  return {type: CREATE_SCREENING_FAILURE, error}
}

export function createScreening() {
  return (dispatch) => dispatch({type: CREATE_SCREENING})
}

export function fetchScreeningSuccess(screening) {
  return {type: FETCH_SCREENING_SUCCESS, screening}
}

export function fetchScreening(screeningId) {
  return (dispatch) => (
    get(`/api/v1/screenings/${screeningId}`)
      .then((jsonResponse) => dispatch(fetchScreeningSuccess(jsonResponse)))
  )
}

export function updateScreeningSuccess(screening) {
  return {type: UPDATE_SCREENING_SUCCESS, screening}
}

export function saveScreening(screening) {
  return (dispatch) => (
    put(`/api/v1/screenings/${screening.id}`, {screening})
      .then((jsonResponse) => dispatch(updateScreeningSuccess(jsonResponse)))
  )
}

export function updateParticipantSuccess(participant) {
  return {type: UPDATE_PARTICIPANT_SUCCESS, participant}
}

export function updateParticipantFailure(error) {
  return {type: UPDATE_PARTICIPANT_FAILURE, error}
}

export function saveParticipant(participant) {
  return (dispatch, getState) => (
    put(`/api/v1/participants/${participant.id}`, {participant})
      .then(
        (participant) => {
          dispatch(updateParticipantSuccess(participant))
          fetchScreening(getState().getIn(['screening', 'id']))(dispatch)
        },
        (error) => dispatch(updateParticipantFailure(error))
      )
  )
}

export function createParticipantSuccess(participant) {
  return {type: CREATE_PARTICIPANT_SUCCESS, participant}
}

export function createParticipant(participant) {
  return (dispatch) => (
    post('/api/v1/participants', {participant})
      .then((jsonResponse) => {
        dispatch(createParticipantSuccess(jsonResponse))
      })
  )
}

export function deleteParticipantSuccess(id) {
  return {type: DELETE_PARTICIPANT_SUCCESS, id}
}

export function deleteParticipant(id) {
  return (dispatch) => (
    destroy(`/api/v1/participants/${id}`)
      .then(() => dispatch(deleteParticipantSuccess(id)))
  )
}

export function fetchHistoryOfInvolvementsSuccess(history_of_involvements) {
  return {type: FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS, history_of_involvements}
}

export function fetchHistoryOfInvolvements(screeningId) {
  return (dispatch) => (
    get(`/api/v1/screenings/${screeningId}/history_of_involvements`)
      .then((jsonResponse) => dispatch(fetchHistoryOfInvolvementsSuccess(jsonResponse)))
  )
}

export function submitScreeningSuccess(screening) {
  const referralId = screening.referral_id
  /* eslint-disable no-alert */
  alert(`Successfully created referral ${referralId}`)
  /* eslint-enable no-alert */
  return {type: SUBMIT_SCREENING_SUCCESS, screening}
}

export function submitScreeningFailure(jsonResponse) {
  /* eslint-disable no-alert */
  alert(jsonResponse.responseText)
  /* eslint-enable no-alert */
  return {type: SUBMIT_SCREENING_FAILURE}
}

export function submitScreening(screeningId) {
  return (dispatch) => (
    post(`/api/v1/screenings/${screeningId}/submit`, null)
      .then(
        (jsonResponse) => { dispatch(submitScreeningSuccess(jsonResponse)) },
        (jsonResponse) => { dispatch(submitScreeningFailure(jsonResponse)) }
      )
  )
}

export function fetchRelationshipsByScreeningIdSuccess(relationships) {
  return {type: FETCH_RELATIONSHIPS_SUCCESS, relationships}
}

export function fetchRelationshipsByScreeningId(screeningId) {
  return (dispatch) => (
    get(`/api/v1/screenings/${screeningId}/relationships`)
      .then((jsonResponse) => dispatch(fetchRelationshipsByScreeningIdSuccess(jsonResponse)))
  )
}
