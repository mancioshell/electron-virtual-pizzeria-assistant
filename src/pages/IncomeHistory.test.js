import React from 'react'

import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import IncomeHistory from './IncomeHistory'

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
  render(<IncomeHistory />)
})
