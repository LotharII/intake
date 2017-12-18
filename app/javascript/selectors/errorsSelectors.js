import {Map} from 'immutable'
import {createSelector} from 'reselect'

export const getErrors = (state) => state.get('errors', Map())
export const getHasGenericErrorValueSelector = createSelector(
  getErrors,
  (errors) => (errors.size > 0)
)
export const getConstraintValidationErrorsSelector = createSelector(
  getErrors,
  (errors) => (errors.toIndexedSeq().flatten(true).filter((error) => (error && error.get('type') === 'constraint_validation')).toList())
)
export const getScreeningSubmissionErrorsSelector = createSelector(
  getConstraintValidationErrorsSelector,
  (constraintValidationErrors) => (
    constraintValidationErrors.map((error) =>
      (`${error.get('property')} ${error.get('user_message')} (Incident Id: ${error.get('incident_id')})`))
  )
)
export const getSystemErrorsSelector = createSelector(
  getErrors,
  (errors) => (errors.toIndexedSeq().flatten(true).filter((error) => (error && error.get('type') !== 'constraint_validation')).toList())
)
export const getSystemErrorIncidentIdsSelector = createSelector(
  getSystemErrorsSelector,
  (systemErrors) => (systemErrors.map((error) => (error.get('incident_id'))))
)
export const getPageErrorMessageValueSelector = createSelector(
  getErrors,
  getSystemErrorIncidentIdsSelector,
  getConstraintValidationErrorsSelector,
  (errors, systemErrorIncidentIds, constraintValidationErrors) => {
    if (constraintValidationErrors.size) {
      return `${constraintValidationErrors.size} error(s) have been identified. Please fix them and try submitting again.`
    } else {
      let message = 'Something went wrong, sorry! Please try your last action again.'
      if (systemErrorIncidentIds.size) {
        message += ` (Ref #: ${systemErrorIncidentIds.toJS().join(', ')})`
      }
      return message
    }
  }
)