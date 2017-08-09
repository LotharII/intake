import CrossReportCardView from 'screenings/CrossReportCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('CrossReportCardView', () => {
  let component
  let promiseObj
  let validateFieldSpy

  const props = {
    areCrossReportsRequired: true,
    crossReports: Immutable.fromJS([
      {agency_type: 'District attorney', agency_name: 'SCDA Office'},
      {agency_type: 'Department of justice'},
    ]),
  }
  beforeEach(() => {
    props.onEdit = jasmine.createSpy()
    promiseObj = jasmine.createSpyObj('promiseObj', ['then'])
    props.onCancel = jasmine.createSpy()
    props.onChange = jasmine.createSpy()
    props.onSave = jasmine.createSpy()
  })

  describe('crossReportsInclude', () => {
    it('returns true if cross reports includes the agency type passed', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'District attorney'}])
      const component = shallow(<CrossReportCardView {...props} mode='show' crossReports={crossReports} />)
      expect(component.instance().crossReportsInclude('District attorney')).toEqual(true)
    })

    it('returns false if cross reports do not include the agency type passed', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'Disctrict attorney'}])
      const component = shallow(<CrossReportCardView {...props} mode='show' crossReports={crossReports} />)
      expect(component.instance().crossReportsInclude('Law enforcement')).toEqual(false)
    })
  })

  describe('alertInfoMessage', () => {
    it('returns null when cross reports are not required', () => {
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          areCrossReportsRequired={false}
        />
      )
      expect(component.instance().alertInfoMessage()).toEqual(null)
    })

    it('returns a message when cross reports are required and none have been selected', () => {
      const crossReports = Immutable.List()
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().alertInfoMessage()).toContain('Any report that includes allegations')
    })

    it('returns a message when cross reports are required but district attorney has not been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'Law enforcement'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().alertInfoMessage()).toContain('Any report that includes allegations')
    })

    it('returns a message when cross reports are required but law enforcement has not been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'District attorney'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().alertInfoMessage()).toContain('Any report that includes allegations')
    })

    it('returns a message when cross reports are required, and law enforcement and D.A. have both been selected', () => {
      const crossReports = Immutable.fromJS([{agency_type: 'District attorney'}, {agency_type: 'Law enforcement'}])
      const component = shallow(
        <CrossReportCardView
          {...props}
          mode='show'
          crossReports={crossReports}
          areCrossReportsRequired={true}
        />
      )
      expect(component.instance().alertInfoMessage()).toEqual(null)
    })
  })

  describe('render', () => {
    describe('when mode is set to edit', () => {
      beforeEach(() => {
        promiseObj.then.and.callFake((thenFunction) => thenFunction())
        props.onSave.and.returnValue(promiseObj)
        component = shallow(<CrossReportCardView {...props} mode='edit'/>)
      })

      it('renders the edit view', () => {
        expect(component.find('CrossReportEditView').length).toEqual(1)
        expect(component.find('CrossReportEditView').props().isAgencyRequired).toEqual(jasmine.any(Function))
        expect(component.find('CrossReportEditView').props().isAgencyRequired).toEqual(jasmine.any(Function))
        expect(component.find('CrossReportEditView').props().crossReports.toJS()).toEqual([
          {agency_type: 'District attorney', agency_name: 'SCDA Office'},
          {agency_type: 'Department of justice'},
        ])
      })

      describe('isAgencyRequired', () => {
        it('returns true if the agency is required and cross reporting is required', () => {
          expect(component.instance().isAgencyRequired('District attorney')).toEqual(true)
        })

        it('returns false if an agency is not required even if cross reporting is required', () => {
          expect(component.instance().isAgencyRequired('Licensing')).toEqual(false)
        })

        it('returns false if cross reporting is not required', () => {
          component = shallow(<CrossReportCardView {...props} mode='edit' areCrossReportsRequired={false}/>)
          expect(component.instance().isAgencyRequired('District attorney')).toEqual(false)
        })
      })

      describe('isAgencyChecked', () => {
        beforeEach(() => {
          component = shallow(
            <CrossReportCardView {...props}
              crossReports={Immutable.fromJS([
                {agency_type: 'Law enforcement'},
              ])}
              mode='edit'
            />
          )
        })
        it('returns true if agency is checked', () => {
          expect(component.instance().isAgencyChecked('Law enforcement')).toEqual(true)
        })
        it('returns false if agency is NOT checked', () => {
          expect(component.instance().isAgencyChecked('District attorney')).toEqual(false)
        })
      })

      describe('onChange', () => {
        let validationProps
        beforeEach(() => {
          validationProps = {
            onChange: jasmine.createSpy('onChange'),
            onCancel: jasmine.createSpy('onCancel'),
            onSave: jasmine.createSpy('onSave'),
            areCrossReportsRequired: true,
            crossReports: Immutable.fromJS([
              {agency_type: 'District attorney', agency_name: 'SCDA Office'},
              {agency_type: 'Department of justice'},
            ]),
          }
          validateFieldSpy = spyOn(CrossReportCardView.prototype, 'validateField').and.callThrough()
          component = shallow(<CrossReportCardView {...validationProps} mode='edit' />)
        })

        it('is called by a child onChange', () => {
          const report = Immutable.fromJS([
            {agency_type: 'District attorney', agency_name: 'LAPD'},
            {agency_type: 'Department of justice'},
          ])
          component.find('CrossReportEditView').props().onChange(
            report,
            ['agency_name', 'District attorney']
          )
          expect(validationProps.onChange).toHaveBeenCalledWith(
            ['cross_reports'],
            report
          )
        })

        it('is sends its onChange to children', () => {
          expect(component.find('CrossReportEditView').props().onChange).toEqual(component.instance().onChange)
        })

        describe('calling validateField', () => {
          beforeEach(() => {
            component.setState({
              errors: Immutable.fromJS({
                'Law enforcement': {
                  agency_type: ['Please indicate cross-reporting to law enforcement.'],
                  agency_name: [],
                  communication_method: [],
                  reported_on: [],
                },
                'District attorney': {
                  agency_type: [],
                  agency_name: ['Please enter an agency name.'],
                  communication_method: ['Please select cross-report communication method.'],
                  reported_on: ['Please enter a cross-report date.'],
                },
              }),
              mode: 'edit',
            })
          })

          it('handles agency_type if it got added', () => {
            component.instance().onChange(
              Immutable.fromJS([
                {agency_type: 'District attorney', agency_name: 'LAPD'},
                {agency_type: 'Law enforcement'},
              ]),
              ['agency_type', 'Law enforcement']
            )
            expect(validateFieldSpy).toHaveBeenCalledWith('Law enforcement', 'agency_type', true)
          })

          it('handles agency_type if it got removed', () => {
            component.instance().onChange(
              Immutable.fromJS([
                {agency_type: 'District attorney', agency_name: 'LAPD'},
                {agency_type: 'Department of justice'},
              ]),
              ['agency_type', 'Law enforcement']
            )
            expect(validateFieldSpy).toHaveBeenCalledWith('Law enforcement', 'agency_type', false)
          })

          it('handles communication_method & reported_on', () => {
            component.instance().onChange(
              Immutable.fromJS([
                {agency_type: 'District attorney', agency_name: 'LAPD'},
                {agency_type: 'Department of justice'},
              ]),
              ['communication_method']
            )
            expect(validateFieldSpy.calls.count()).toEqual(4)
          })

          it('handles agency_name', () => {
            component.instance().onChange(
              Immutable.fromJS([
                {agency_type: 'District attorney', agency_name: 'LAPD'},
                {agency_type: 'Department of justice'},
              ]),
              ['agency_name', 'District attorney']
            )
            expect(validateFieldSpy).toHaveBeenCalledWith('District attorney', 'agency_name', 'LAPD')
          })

          it('does not make the call if there are no errors on the changed field', () => {
            component.instance().onChange(
              Immutable.fromJS([
                {agency_type: 'Law enforcement', agency_name: 'LAPD'},
                {agency_type: 'Department of justice'},
              ]),
              ['agency_name', 'Law enforcement']
            )
            expect(validateFieldSpy).not.toHaveBeenCalled()
          })
        })
      })

      describe('validateField', () => {
        it('sets error if Law enforcement is required but not checked', () => {
          const actualErrors = component.instance().validateField('Law enforcement', 'agency_type', false)
          const expectedErrors = {
            'Law enforcement': {agency_type: ['Please indicate cross-reporting to law enforcement.']},
          }
          expect(actualErrors.toJS()).toEqual(expectedErrors)
        })

        it('does not set a new error if Law enforcement is required and checked', () => {
          const actualErrors = component.instance().validateField('Law enforcement', 'agency_type', true)
          const expectedErrors = {
            'Law enforcement': {agency_type: []},
          }
          expect(actualErrors.toJS()).toEqual(expectedErrors)
        })
      })

      describe('when mode gets changed from edit to show', () => {
        let setStateSpy
        beforeEach(() => {
          setStateSpy = spyOn(CrossReportCardView.prototype, 'setState').and.callThrough()
          component = mount(<CrossReportCardView {...props} mode='edit'/>)
        })

        it('renders the cross report show view', () => {
          component.find('button[children="Cancel"]').simulate('click')
          expect(component.find('CrossReportShowView').length).toEqual(1)
        })

        it('validates all cross reports', () => {
          component = mount(<CrossReportCardView {...props} mode='edit'/>)
          component.setProps({mode: 'show'})
          expect(setStateSpy).toHaveBeenCalled()
          const actualErrors = setStateSpy.calls.argsFor(0)[0].errors
          const expectedErrors = {
            'Law enforcement': {
              agency_type: ['Please indicate cross-reporting to law enforcement.'],
              agency_name: [],
              communication_method: [],
              reported_on: [],
            },
            'District attorney': {
              agency_type: [],
              agency_name: [],
              communication_method: ['Please select cross-report communication method.'],
              reported_on: ['Please enter a cross-report date.'],
            },
            'Department of justice': {
              agency_name: ['Please enter an agency name.'],
              communication_method: ['Please select cross-report communication method.'],
              reported_on: ['Please enter a cross-report date.'],
            },
            Licensing: {agency_name: [], communication_method: [], reported_on: []},
          }
          expect(actualErrors.toJS()).toEqual(expectedErrors)
        })

        it('calls the props onSave when save is clicked', () => {
          component.find('button[children="Save"]').simulate('click')
          expect(props.onSave).toHaveBeenCalled()
        })
      })
    })

    describe('validateAllCrossReports', () => {
      it('set the state with errors for all cross reports', () => {
        component = shallow(<CrossReportCardView {...props} mode='show'/>)
        const actualErrors = component.instance().validateAllCrossReports()
        const expectedErrors = {
          'Law enforcement': {
            agency_type: ['Please indicate cross-reporting to law enforcement.'],
            agency_name: [],
            communication_method: [],
            reported_on: [],
          },
          'District attorney': {
            agency_type: [],
            agency_name: [],
            communication_method: ['Please select cross-report communication method.'],
            reported_on: ['Please enter a cross-report date.'],
          },
          'Department of justice': {
            agency_name: ['Please enter an agency name.'],
            communication_method: ['Please select cross-report communication method.'],
            reported_on: ['Please enter a cross-report date.'],
          },
          Licensing: {agency_name: [], communication_method: [], reported_on: []},
        }
        expect(actualErrors.toJS()).toEqual(expectedErrors)
      })
    })

    describe('when mode is set to show', () => {
      beforeEach(() => {
        component = mount(<CrossReportCardView {...props} mode='show'/>)
      })

      it('renders the cross report show card', () => {
        expect(component.find('CrossReportShowView').length).toEqual(1)
      })

      it('validates all fields and pass errors to show view', () => {
        const expectedErrors = {
          'Law enforcement': {
            agency_type: ['Please indicate cross-reporting to law enforcement.'],
            agency_name: [],
            communication_method: [],
            reported_on: [],
          },
          'District attorney': {
            agency_type: [],
            agency_name: [],
            communication_method: ['Please select cross-report communication method.'],
            reported_on: ['Please enter a cross-report date.'],
          },
          'Department of justice': {
            agency_name: ['Please enter an agency name.'],
            communication_method: ['Please select cross-report communication method.'],
            reported_on: ['Please enter a cross-report date.'],
          },
          Licensing: {agency_name: [], communication_method: [], reported_on: []},
        }
        expect(component.find('CrossReportShowView').props().errors.toJS()).toEqual(expectedErrors)
      })

      describe('when the user clicks edit link', () => {
        beforeEach(() => {
          const editLink = component.find('a[aria-label="Edit cross report"]')
          editLink.simulate('click')
        })

        it('it renders the cross report edit card', () => {
          expect(component.find('CrossReportEditView').length).toEqual(1)
        })
      })
    })
  })
})
