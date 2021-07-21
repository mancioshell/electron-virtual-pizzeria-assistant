import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import IncomeHistory from './IncomeHistory'

import i18NextCustomRender from '../i18n.test'
import incomeHistoryFormConfig from '../../public/locales/it/income-history-form.json'
import incomeHistoryConfig from '../../public/locales/it/income-history.json'

const customRender = (ui, renderOptions) =>
  i18NextCustomRender(
    ui,
    { ...incomeHistoryFormConfig, ...incomeHistoryConfig },
    renderOptions
  )

const data = [
  { total: 9, date: new Date() },
  { total: 12, date: new Date() },
  { total: 90, date: new Date(), current: true },
  { total: 34, date: new Date() }
]

beforeEach(() => {
  window.api = {
    getTotalIncomeByType: jest.fn().mockImplementation(async () => data)
  }
})

afterEach(() => {})

test('rendering IncomeHistory', async () => {
  customRender(<IncomeHistory />)
})
