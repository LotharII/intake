import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'

const ShowField = ({gridClassName, labelClassName, label, children, required, errors}) => (
  <div className={gridClassName}>
    <label className={
        ClassNames(labelClassName,
          {required: required},
          {'input-error-label': !_.isEmpty(errors)}
        )
      }>{label}</label>
    <div className='c-gray'>{children}</div>
    <div>
      {!_.isEmpty(errors) &&
        errors.map((error, index) =>
          <span key={index} className='input-error-message' role='alert'>{error}</span>
        )
      }
    </div>
  </div>
)

ShowField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]),
  errors: PropTypes.object,
  gridClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  required: PropTypes.bool,
}
export default ShowField
