import {List} from 'immutable'
export const findByCategory = (statusCodes = List(), selectedCategory) => (
  statusCodes.filter(({category}) => category === selectedCategory)
)

export const findByCode = (statusCodes, selectedCode) => (
  statusCodes.filter(({code}) => code === selectedCode)
)
