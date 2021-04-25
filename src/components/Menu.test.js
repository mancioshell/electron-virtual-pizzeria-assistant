import React from 'react'

import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Menu from './Menu'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

let settings = {
  name: 'La Pinseria JG'
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

  render(
    <Router history={history}>
      <Menu />
    </Router>
  )

  await waitFor(() => {
    expect(screen.getByText(new RegExp(`^${settings.name}`, 'i')))
  })
})
