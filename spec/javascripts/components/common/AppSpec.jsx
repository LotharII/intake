import {App} from 'common/App'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('App', () => {
  function mountApp({actions: {fetchSystemCodesAction = () => null, fetchUserInfoAction = () => null}}) {
    return mount(<App actions={{fetchSystemCodesAction, fetchUserInfoAction}}><div/></App>)
  }

  function renderApp({actions = {}, hasError = null, errorCount = null}) {
    return shallow(<App actions={actions} hasError={hasError} errorCount={errorCount} ><div/></App>)
  }

  it('fetches the system codes when the component mounts', () => {
    const fetchSystemCodesActionSpy = jasmine.createSpy('fetchSystemCodesAction')
    mountApp({actions: {fetchSystemCodesAction: fetchSystemCodesActionSpy}})
    expect(fetchSystemCodesActionSpy).toHaveBeenCalled()
  })

  it('fetches user info when the component mounts', () => {
    const fetchUserInfoActionSpy = jasmine.createSpy('fetchUserInfoAction')
    mountApp({actions: {fetchUserInfoAction: fetchUserInfoActionSpy}})
    expect(fetchUserInfoActionSpy).toHaveBeenCalled()
  })

  it('renders the global header component on all app views', () => {
    const app = renderApp({hasError: false})
    expect(app.find('GlobalHeader').exists()).toEqual(true)
  })

  describe('error banner', () => {
    it('is not rendered when no errors', () => {
      const component = renderApp({hasError: false})
      expect(component.find('PageError').exists()).toEqual(false)
    })
    it('is rendered when generic error occurs', () => {
      const component = renderApp({hasError: true})
      expect(component.find('PageError').exists()).toEqual(true)
    })
    it('is rendered when pageErrorMessage exists', () => {
      const component = renderApp({hasError: true, pageErrorMessage: 'pageErrorMessage'})
      expect(component.find('PageError').exists()).toEqual(true)
    })
  })
})
