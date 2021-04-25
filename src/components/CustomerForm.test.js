import React from 'react'

import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CustomerForm from './CustomerForm'
import userEvent from '@testing-library/user-event'

let customer = { name: '', surname: '', address: '', phone: '' }
let saveCustomer

beforeEach(() => {
  saveCustomer = jest.fn()
})

afterEach(() => {
  saveCustomer.mockRestore()
})

test('rendering and submitting a CustomerForm', async () => {
  render(<CustomerForm customer={customer} saveCustomer={saveCustomer} />)

  userEvent.type(screen.getByLabelText(/Nome/), 'John')
  userEvent.type(screen.getByLabelText(/Cognome/), 'Dee')
  userEvent.type(screen.getByLabelText(/Indirizzo/), 'Via degli Estensi 64')
  userEvent.type(screen.getByLabelText(/Recapito Telefonico/), '06 3432423')

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveCustomer).toHaveBeenCalledWith(
      {
        name: 'John',
        surname: 'Dee',
        address: 'Via degli Estensi 64',
        phone: '06 3432423'
      },
      expect.anything()
    )
  })
})

test('display an error on submitting', async () => {
  render(<CustomerForm customer={customer} saveCustomer={saveCustomer} />)

  userEvent.type(screen.getByLabelText(/Cognome/), 'Dee')
  userEvent.type(screen.getByLabelText(/Indirizzo/), 'Via degli Estensi 64')
  userEvent.type(screen.getByLabelText(/Recapito Telefonico/), '06 3432423')

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveCustomer).not.toHaveBeenCalled()
    expect(screen.getByTestId('name')).toHaveClass('is-invalid')
    expect(screen.getByTestId('surname')).toHaveClass('is-valid')
    expect(screen.getByTestId('address')).toHaveClass('is-valid')
    expect(screen.getByTestId('phone')).toHaveClass('is-valid')
  })
})
