import {
  getCardModeValueSelector,
  getCardIsEditableSelector,
  getAllCardsAreSavedValueSelector,
  getScreeningHasErrorsSelector,
} from 'selectors/screening/screeningPageSelectors'
import {fromJS} from 'immutable'

describe('screeningPageSelectors', () => {
  describe('getCardModeValueSelector', () => {
    it('returns the current mode for a given card', () => {
      const screeningPage = {cards: {'some-card': 'show'}}
      const state = fromJS({screeningPage})
      expect(getCardModeValueSelector(state, 'some-card')).toEqual('show')
    })
  })

  describe('getCardIsEditableSelector', () => {
    it('returns false if the screening is read only', () => {
      const screening = {referral_id: '123'}
      const screeningPage = {cards: {'some-card': 'show'}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(false)
    })

    it('returns false if the card is already in edit mode', () => {
      const screening = {referral_id: ''}
      const screeningPage = {cards: {'some-card': 'edit'}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(false)
    })

    it('returns true if the card is in show mode and the screening is not read only', () => {
      const screening = {referral_id: ''}
      const screeningPage = {cards: {'some-card': 'show'}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(true)
    })
  })

  describe('getAllCardsAreSavedValueSelector', () => {
    it('returns true when all cards are in show mode', () => {
      const screeningPage = {
        peopleCards: {some_id: 'show', other_id: 'show'},
        cards: {some_card: 'show', other_card: 'show'},
      }
      const state = fromJS({screeningPage})
      expect(getAllCardsAreSavedValueSelector(state)).toEqual(true)
    })

    it('returns false when any cards are in edit mode', () => {
      const screeningPage = {
        peopleCards: {some_id: 'show', other_id: 'show'},
        cards: {some_card: 'show', other_card: 'edit'},
      }
      const state = fromJS({screeningPage})
      expect(getAllCardsAreSavedValueSelector(state)).toEqual(false)
    })

    it('returns false when any person cards are in edit mode', () => {
      const screeningPage = {
        peopleCards: {some_id: 'show', other_id: 'edit'},
        cards: {some_card: 'show', other_card: 'show'},
      }
      const state = fromJS({screeningPage})
      expect(getAllCardsAreSavedValueSelector(state)).toEqual(false)
    })
  })

  describe('getScreeningHasErrorsSelector', () => {
    it('returns false if there are no errors for the screening', () => {
      const screening = {
        report_narrative: 'My narrative',
        screening_decision: 'differential_response',
        communication_method: 'fax',
        assignee: 'Bob Smith',
        started_at: '2002-01-02',
      }
      const state = fromJS({screening})
      expect(getScreeningHasErrorsSelector(state)).toEqual(false)
    })

    it('returns true if the screening has errors for a field', () => {
      const screening = {
        report_narrative: 'My narrative',
        screening_decision: 'differential_response',
        communication_method: 'fax',
        assignee: 'Bob Smith',
        started_at: null,
      }
      const state = fromJS({screening})
      expect(getScreeningHasErrorsSelector(state)).toEqual(true)
    })
  })
})
