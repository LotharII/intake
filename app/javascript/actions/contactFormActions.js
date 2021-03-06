export const BUILD_CONTACT = 'BUILD_CONTACT'
export const BUILD_CONTACT_COMPLETE = 'BUILD_CONTACT_COMPLETE'
export const SET_CONTACT_FIELD = 'SET_CONTACT_FIELD'
export const TOUCH_CONTACT_FIELD = 'TOUCH_CONTACT_FIELD'
export const TOUCH_ALL_CONTACT_FIELDS = 'TOUCH_ALL_CONTACT_FIELDS'
export const SELECT_CONTACT_PERSON = 'SELECT_CONTACT_PERSON'
export const DESELECT_CONTACT_PERSON = 'DESELECT_CONTACT_PERSON'
export const EDIT_CONTACT = 'EDIT_CONTACT'
export const EDIT_CONTACT_COMPLETE = 'EDIT_CONTACT_COMPLETE'
export function build({investigation_id}) {
  return {type: BUILD_CONTACT, payload: {investigation_id}}
}
export function buildSuccess({investigation_id, investigation_started_at, investigation_people}) {
  return {
    type: BUILD_CONTACT_COMPLETE,
    payload: {
      investigation_id,
      investigation_started_at,
      investigation_people,
    },
  }
}
export function buildFailure(error) {
  return {type: BUILD_CONTACT_COMPLETE, payload: {error}, error: true}
}
export function setField(field, value) {
  return {
    type: SET_CONTACT_FIELD,
    payload: {field, value},
  }
}
export function selectPerson(index) {
  return {
    type: SELECT_CONTACT_PERSON,
    payload: {index},
  }
}
export function deselectPerson(index) {
  return {
    type: DESELECT_CONTACT_PERSON,
    payload: {index},
  }
}
export function touchField(field) {
  return {type: TOUCH_CONTACT_FIELD, payload: {field}}
}
export function touchAllFields() {
  return {type: TOUCH_ALL_CONTACT_FIELDS}
}
export function edit({id, investigation_id}) {
  return {type: EDIT_CONTACT, payload: {id, investigation_id}}
}
export function editSuccess({investigation_id, investigation_started_at, investigation_people, contact}) {
  return {
    type: EDIT_CONTACT_COMPLETE,
    payload: {
      investigation_id,
      investigation_started_at,
      investigation_people,
      contact,
    },
  }
}
export function editFailure(error) {
  return {type: EDIT_CONTACT_COMPLETE, payload: {error}, error: true}
}
