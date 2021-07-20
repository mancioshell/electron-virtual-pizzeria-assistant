import React from 'react'

import { waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import IncomeHistoryForm from './IncomeHistoryForm'
import userEvent from '@testing-library/user-event'

import i18NextCustomRender from '../i18n.test'
import config from '../../public/locales/it/income-history-form.json'

let setIncomeType
let setDate

const customRender = (ui, renderOptions) =>
  i18NextCustomRender(ui, { ...config }, renderOptions)

beforeEach(() => {
  setIncomeType = jest.fn()
  setDate = jest.fn()
})

afterEach(() => {
  setIncomeType.mockRestore()
  setDate.mockRestore()
})

test('rendering and select from day to week', async () => {
  let incomeType = 'day'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  userEvent.selectOptions(screen.getByLabelText(/Incasso per/), 'week')

  await waitFor(() => {
    expect(setIncomeType).toHaveBeenCalledWith('week')
    expect(setDate).toHaveBeenCalledWith(expect.any(Date))
  })
})

test('rendering and select from day to month', async () => {
  let incomeType = 'day'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  userEvent.selectOptions(screen.getByLabelText(/Incasso per/), 'month')

  await waitFor(() => {
    expect(setIncomeType).toHaveBeenCalledWith('month')
    expect(setDate).toHaveBeenCalledWith(expect.any(Date))
  })
})

test('rendering and select from week to month', async () => {
  let incomeType = 'week'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  userEvent.selectOptions(screen.getByLabelText(/Incasso per/), 'month')

  await waitFor(() => {
    expect(setIncomeType).toHaveBeenCalledWith('month')
    expect(setDate).toHaveBeenCalledWith(expect.any(Date))
  })
})

test('rendering and select from week to day', async () => {
  let incomeType = 'week'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  userEvent.selectOptions(screen.getByLabelText(/Incasso per/), 'day')

  await waitFor(() => {
    expect(setIncomeType).toHaveBeenCalledWith('day')
    expect(setDate).toHaveBeenCalledWith(expect.any(Date))
  })
})

test('rendering and select from month to week', async () => {
  let incomeType = 'month'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  userEvent.selectOptions(screen.getByLabelText(/Incasso per/), 'week')

  await waitFor(() => {
    expect(setIncomeType).toHaveBeenCalledWith('week')
    expect(setDate).toHaveBeenCalledWith(expect.any(Date))
  })
})

test('rendering and select from month to day', async () => {
  let incomeType = 'month'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  userEvent.selectOptions(screen.getByLabelText(/Incasso per/), 'day')

  await waitFor(() => {
    expect(setIncomeType).toHaveBeenCalledWith('day')
    expect(setDate).toHaveBeenCalledWith(expect.any(Date))
  })
})

test('rendering and click next button when incomeType is day', async () => {
  let incomeType = 'day'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  let nextDay = new Date(date)
  nextDay.setDate(date.getDate() + 1)

  userEvent.click(screen.getByText('Successivo'))

  await waitFor(() => {
    expect(setDate).toHaveBeenCalledWith(nextDay)
  })
})

test('rendering and click next button when incomeType is week', async () => {
  let incomeType = 'week'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  let nextDay = new Date(date)
  nextDay.setDate(date.getDate() + 7)

  userEvent.click(screen.getByText('Successivo'))

  await waitFor(() => {
    expect(setDate).toHaveBeenCalledWith(nextDay)
  })
})

test('rendering and click next button when incomeType is month', async () => {
  let incomeType = 'month'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  let nextDay = new Date(date)
  nextDay.setDate(
    date.getDate() + new Date(date.getYear(), date.getMonth() + 1, 0).getDate()
  )

  userEvent.click(screen.getByText('Successivo'))

  await waitFor(() => {
    expect(setDate).toHaveBeenCalledWith(nextDay)
  })
})

test('rendering and click prev button when incomeType is day', async () => {
  let incomeType = 'day'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  let prevDay = new Date(date)
  prevDay.setDate(date.getDate() - 1)

  userEvent.click(screen.getByText('Precedente'))

  await waitFor(() => {
    expect(setDate).toHaveBeenCalledWith(prevDay)
  })
})

test('rendering and click prev button when incomeType is week', async () => {
  let incomeType = 'week'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  let prevDay = new Date(date)
  prevDay.setDate(date.getDate() - 7)

  userEvent.click(screen.getByText('Precedente'))

  await waitFor(() => {
    expect(setDate).toHaveBeenCalledWith(prevDay)
  })
})

test('rendering and click prev button when incomeType is month', async () => {
  let incomeType = 'month'
  let date = new Date()

  customRender(
    <IncomeHistoryForm
      incomeType={incomeType}
      setIncomeType={setIncomeType}
      setDate={setDate}
      date={date}
    />
  )

  let prevDay = new Date(date)
  prevDay.setDate(
    date.getDate() - new Date(date.getYear(), date.getMonth() + 1, 0).getDate()
  )

  userEvent.click(screen.getByText('Precedente'))

  await waitFor(() => {
    expect(setDate).toHaveBeenCalledWith(prevDay)
  })
})
