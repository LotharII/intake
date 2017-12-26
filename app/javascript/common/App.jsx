import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {
  getHasGenericErrorValueSelector,
  getPageErrorMessageSelector,
} from 'selectors/errorsSelectors'
import {getUserNameSelector} from 'selectors/userInfoSelectors'
import {fetch as fetchSystemCodesAction} from 'actions/systemCodesActions'
import {fetch as fetchUserInfoAction} from 'actions/userInfoActions'
import {bindActionCreators} from 'redux'
import PageError from 'common/PageError'
import {GlobalHeader} from 'react-wood-duck'
import userNameFormatter from 'utils/userNameFormatter'

export class App extends React.Component {
  componentDidMount() {
    this.props.actions.fetchSystemCodesAction()
    this.props.actions.fetchUserInfoAction()
  }

  render() {
    const {hasError, fullName, pageErrorMessage} = this.props
    return (
      <div>
        <GlobalHeader profileName={fullName} />
        {(hasError) && <PageError pageErrorMessage={pageErrorMessage} />}
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  fullName: PropTypes.string,
  hasError: PropTypes.bool,
  pageErrorMessage: PropTypes.string,
}
const mapStateToProps = (state) => ({
  hasError: getHasGenericErrorValueSelector(state),
  fullName: userNameFormatter(getUserNameSelector(state)),
  pageErrorMessage: getPageErrorMessageSelector(state),
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  actions: bindActionCreators({
    fetchSystemCodesAction,
    fetchUserInfoAction,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
