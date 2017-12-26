import {Map} from 'immutable'
import {createSelector} from 'reselect'

export const getErrors = (state) => state.get('errors', Map())
export const getHasGenericErrorValueSelector = createSelector(
  getErrors,
  (errors) => (errors.size > 0)
)
export const getConstraintValidationErrorsSelector = createSelector(
  getErrors,
  (errors) => (errors.toIndexedSeq().flatten(true).filter((error) => (error && error.get('type') === 'constraint_validation')).toJS())
)
export const getScreeningSubmissionErrorsSelector = createSelector(
  getConstraintValidationErrorsSelector,
  (constraintValidationErrors) => (
    constraintValidationErrors.map((error) =>
      (`${error.property} ${error.user_message} (Incident Id: ${error.incident_id})`))
  )
)
export const getSystemErrorsSelector = createSelector(
  getErrors,
  (errors) => (errors.toIndexedSeq().flatten(true).filter((error) => (error && error.get('type') !== 'constraint_validation')).toJS())
)
export const getSystemErrorIncidentIdsSelector = createSelector(
  getSystemErrorsSelector,
  (systemErrors) => (systemErrors.map((error) => {
    if (error) {
      return error.incident_id
    }
    return ''
  }).join(', '))
)
export const getPageErrorMessageSelector = createSelector(
  getErrors,
  getSystemErrorIncidentIdsSelector,
  getConstraintValidationErrorsSelector,
  (errors, systemErrorIncidentIds, constraintValidationErrors) => {
    if (constraintValidationErrors.length > 0) {
      return `${constraintValidationErrors.length} error(s) have been identified. Please fix them and try submitting again.`
    } else {
      let message = 'Something went wrong, sorry! Please try your last action again.'
      if (systemErrorIncidentIds) {
        message += ` (Ref #: ${systemErrorIncidentIds})`
      }
      return message
    }
  }
)