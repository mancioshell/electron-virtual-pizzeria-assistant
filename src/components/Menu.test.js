import React from 'react'

import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Menu from './Menu'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { SettingsContext } from '../context/SettingsContext'

let settings = {
  name: 'La Pinseria JG'
}

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <SettingsContext.Provider {...providerProps}>
      {ui}
    </SettingsContext.Provider>,
    renderOptions
  )
}

beforeEach(() => {
  window.api = {
    getSettings: jest.fn().mockImplementation(async () => settings)
  }
})

afterEach(() => {
  //windowSpy.mockRestore();
})

test('loads and displays menu brand', async () => {
  const history = createMemoryHistory()
  const providerProps = {
    value: { settings }
  }

  customRender(
    <Router history={history}>
      <Menu />
    </Router>,
    { providerProps }
  )

  await waitFor(() => {
    expect(screen.getByText(new RegExp(`^${settings.name}`, 'i')))
  })
})
