import * as Utils from 'utils/http'
import {
  saveScreening,
  submitScreening,
  submitScreeningFailure,
  submitScreeningSuccess,
  updateScreeningSuccess,
} from 'actions/screeningActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('screening actions', () => {
  let store
  beforeEach(() => {
    store = mockStore()
  })

  describe('.saveScreening', () => {
    const screening = {id: '3', name: 'mock_screening'}
    beforeEach(() => spyOn(Utils, 'put').and.returnValue(Promise.resolve(screening)))

    it('puts the screening to the server', () => {
      store.dispatch(saveScreening(screening))
      expect(Utils.put).toHaveBeenCalledWith(
        `/api/v1/screenings/${screening.id}`, {screening}
      )
    })

    it('dispatches a updateScreeningSuccess', () => {
      const expectedActions = [updateScreeningSuccess(screening)]
      store.dispatch(saveScreening(screening)).then(() =>
        expect(store.getActions()).toEqual(expectedActions)
      )
    })
  })

  describe('.submitScreening', () => {
    const screeningId = '3'
    beforeEach(() => spyOn(window, 'alert'))

    it('submits a screening to the server', () => {
      spyOn(Utils, 'post').and.returnValue(Promise.resolve())
      store.dispatch(submitScreening(screeningId))
      expect(Utils.post).toHaveBeenCalledWith(
        `/api/v1/screenings/${screeningId}/submit`,
        null
      )
    })

    describe('when server responds with success', () => {
      const referralId = '44'
      const jsonResponse = {referral_id: referralId}
      beforeEach(() => spyOn(Utils, 'post').and.returnValue(Promise.resolve(jsonResponse)))

      it('dispatches a submitScreeningSuccess', () => {
        const expectedActions = [submitScreeningSuccess(jsonResponse)]
        store.dispatch(submitScreening(screeningId)).then(() =>
          expect(store.getActions()).toEqual(expectedActions)
        )
      })

      it('displays an success alert with the referralId', () => {
        store.dispatch(submitScreening(screeningId)).then(() => {
          expect(window.alert).toHaveBeenCalledWith(`Successfully created referral ${referralId}`)
        })
      })
    })

    describe('when server responds with failure', () => {
      const jsonFailureResponse = {responseText: 'Failure response message'}
      beforeEach(() => {
        spyOn(Utils, 'post').and.returnValue(Promise.reject(jsonFailureResponse))
      })

      it('dispatches a submitScreeningFailure', () => {
        const expectedActions = [submitScreeningFailure(jsonFailureResponse)]
        store.dispatch(submitScreening(screeningId)).then(() =>
          expect(store.getActions()).toEqual(expectedActions)
        )
      })

      it('displays an response in an alert', () => {
        store.dispatch(submitScreening(screeningId)).then(() => {
          expect(window.alert).toHaveBeenCalledWith('Failure response message')
        })
      })
    })
  })
})
