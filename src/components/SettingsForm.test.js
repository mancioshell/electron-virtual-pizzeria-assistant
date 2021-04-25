import React from 'react'

import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SettingsForm from './SettingsForm'
import userEvent from '@testing-library/user-event'

let settings = {
  name: '',
  address: '',
  city: '',
  cap: '',
  phone: '',
  network: { address: '', port: '' }
}
let saveSettings

beforeEach(() => {
  saveSettings = jest.fn()
})

afterEach(() => {
  saveSettings.mockRestore()
})

test('rendering and submitting a SettingsForm', async () => {
  render(<SettingsForm settings={settings} saveSettings={saveSettings} />)

  userEvent.type(screen.getByLabelText(/Nome Pizzeria/), 'La Pinseria JG')
  userEvent.type(screen.getByLabelText(/Indirizzo \*/), 'Via Lari 19')
  userEvent.type(screen.getByLabelText(/Indirizzo IP/), '192.168.1.231')
  userEvent.type(screen.getByLabelText(/Città/), 'Roma')
  userEvent.type(screen.getByLabelText(/Cap/), '00146')
  userEvent.type(screen.getByLabelText(/Telefono/), '06 3432423')
  userEvent.type(screen.getByLabelText(/Porta/), '9100')

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveSettings).toHaveBeenCalledWith(
      {
        name: 'La Pinseria JG',
        address: 'Via Lari 19',
        city: 'Roma',
        cap: '00146',
        phone: '06 3432423',
        network: {
          address: '192.168.1.231',
          port: 9100
        }
      },
      expect.anything()
    )
  })
})

test('display an error on submitting', async () => {
  render(<SettingsForm settings={settings} saveSettings={saveSettings} />)

  userEvent.type(screen.getByLabelText(/Nome Pizzeria/), 'La Pinseria JG')

  userEvent.type(screen.getByLabelText(/Indirizzo IP/), '192.168.1.231')
  userEvent.type(screen.getByLabelText(/Città/), 'Roma')
  userEvent.type(screen.getByLabelText(/Cap/), '00146')
  userEvent.type(screen.getByLabelText(/Telefono/), '06 3432423')
  userEvent.type(screen.getByLabelText(/Porta/), '9100')

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveSettings).not.toHaveBeenCalled()
    expect(screen.getByTestId('name')).toHaveClass('is-valid')
    expect(screen.getByTestId('address')).toHaveClass('is-invalid')
    expect(screen.getByTestId('cap')).toHaveClass('is-valid')
    expect(screen.getByTestId('city')).toHaveClass('is-valid')
    expect(screen.getByTestId('phone')).toHaveClass('is-valid')

    expect(screen.getByTestId('network-address')).toHaveClass('is-valid')
    expect(screen.getByTestId('network-port')).toHaveClass('is-valid')
  })
})
