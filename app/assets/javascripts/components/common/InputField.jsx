import MaskedInput from 'react-maskedinput'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'

const InputField = ({gridClassName, labelClassName, id, label, onChange, value, placeholder, type, maxLength, mask, blurPlaceholder, focusPlaceholder}) => {
  let input = (<input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength}/>)

  if (!_.isEmpty(mask)) {
    input =
      <MaskedInput id={id} type={type} value={value} mask={mask} placeholder={placeholder}
        onBlur={(event) => {
          event.target.placeholder = blurPlaceholder
        }}
        onFocus={(event) => {
          event.target.placeholder = focusPlaceholder
        }}
        onChange={onChange}
      />
  }

  return (
    <div className={gridClassName}>
      <label className={labelClassName} htmlFor={id}>{label}</label>
      {input}
    </div>
  )
}

InputField.defaultProps = {
  type: 'text',
  mask: '',
}
InputField.propTypes = {
  blurPlaceholder: PropTypes.string,
  focusPlaceholder: PropTypes.string,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  mask: PropTypes.string,
  maxLength: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}
export default InputField
