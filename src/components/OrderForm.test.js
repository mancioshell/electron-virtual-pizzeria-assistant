import React from 'react'

import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import OrderForm from './OrderForm'
import userEvent from '@testing-library/user-event'
import selectEvent from 'react-select-event'

let options = [
  { name: 'Pizza Margherita', _id: 'asdqweq' },
  { name: 'Pizza Boscaiola', _id: 'qegy5rsd' },
  { name: 'Pizza 4 Formaggi', _id: 'bjudsnasqw' }
]

let currentDate = new Date()

let order = {
  customer: { name: '', surname: '', address: '', phone: '' },
  notes: '',
  time: '',
  date: currentDate,
  items: [
    {
      dish: '',
      amount: 1
    }
  ],
  booking: false
}

let saveOrder, confirmOrder, searchCustomerForm

beforeEach(() => {
  saveOrder = jest.fn()
  confirmOrder = jest.fn()
  searchCustomerForm = jest.fn()

  window.api = {
    getDishList: jest.fn().mockImplementation(async () => options)
  }
})

afterEach(() => {
  saveOrder.mockRestore()
  confirmOrder.mockRestore()
  searchCustomerForm.mockRestore()
})

test('rendering and submitting a OrderForm when click Save button', async () => {
  render(
    <OrderForm
      order={order}
      saveOrder={saveOrder}
      confirmOrder={confirmOrder}
      searchCustomerForm={searchCustomerForm}
    />
  )

  userEvent.type(screen.getByLabelText(/Nome/), 'John')
  userEvent.type(screen.getByLabelText(/Cognome/), 'Doe')
  userEvent.type(screen.getByLabelText(/Indirizzo \*/), 'Via delle vie')
  userEvent.type(screen.getByLabelText(/Recapito Telefonico \*/), '06 3432423')
  userEvent.type(screen.getByLabelText(/Note/), 'Notes')

  await selectEvent.select(screen.getByLabelText(/Portata/), [options[0].name])
  userEvent.clear(screen.getByPlaceholderText('Inserisci la quantità'))
  userEvent.type(screen.getByPlaceholderText('Inserisci la quantità'), '2')

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveOrder).toHaveBeenCalledWith(
      {
        customer: {
          name: 'John',
          surname: 'Doe',
          address: 'Via delle vie',
          phone: '06 3432423'
        },
        notes: 'Notes',
        items: [
          {
            dish: options[0]._id,
            amount: 2
          }
        ],
        booking: false,
        confirm: 0,
        date: currentDate,
        time: ''
      },
      expect.anything()
    )
  })
})

test('rendering and submitting a OrderForm when click Confirm button', async () => {
  render(
    <OrderForm
      order={order}
      saveOrder={saveOrder}
      confirmOrder={confirmOrder}
      searchCustomerForm={searchCustomerForm}
    />
  )

  userEvent.type(screen.getByLabelText(/Nome/), 'John')
  userEvent.type(screen.getByLabelText(/Cognome/), 'Doe')
  userEvent.type(screen.getByLabelText(/Indirizzo \*/), 'Via delle vie')
  userEvent.type(screen.getByLabelText(/Recapito Telefonico \*/), '06 3432423')
  userEvent.type(screen.getByLabelText(/Note/), 'Notes')

  await selectEvent.select(screen.getByLabelText(/Portata/), [options[0].name])
  userEvent.clear(screen.getByPlaceholderText('Inserisci la quantità'))
  userEvent.type(screen.getByPlaceholderText('Inserisci la quantità'), '2')

  userEvent.click(screen.getByRole('button', { name: /Conferma/ }))

  await waitFor(() => {
    expect(confirmOrder).toHaveBeenCalledWith(
      {
        customer: {
          name: 'John',
          surname: 'Doe',
          address: 'Via delle vie',
          phone: '06 3432423'
        },
        notes: 'Notes',
        items: [
          {
            dish: options[0]._id,
            amount: 2
          }
        ],
        booking: false,
        confirm: 1,
        date: currentDate,
        time: ''
      },
      expect.anything()
    )
  })
})

test('display an error on submitting without customer surname', async () => {
  render(
    <OrderForm
      order={order}
      saveOrder={saveOrder}
      confirmOrder={confirmOrder}
      searchCustomerForm={searchCustomerForm}
    />
  )

  userEvent.type(screen.getByLabelText(/Nome/), 'John')
  userEvent.type(screen.getByLabelText(/Indirizzo \*/), 'Via delle vie')
  userEvent.type(screen.getByLabelText(/Recapito Telefonico \*/), '06 3432423')
  userEvent.type(screen.getByLabelText(/Note/), 'Notes')

  await selectEvent.select(screen.getByLabelText(/Portata/), [options[0].name])
  userEvent.clear(screen.getByPlaceholderText('Inserisci la quantità'))
  userEvent.type(screen.getByPlaceholderText('Inserisci la quantità'), '2')

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveOrder).not.toHaveBeenCalled()
    expect(screen.getByTestId('name')).toHaveClass('is-valid')
    expect(screen.getByTestId('surname')).toHaveClass('is-invalid')
    expect(screen.getByTestId('address')).toHaveClass('is-valid')
    expect(screen.getByTestId('phone')).toHaveClass('is-valid')

    expect(screen.getByTestId('notes')).toHaveClass('is-valid')

    expect(screen.queryByTestId(`items.0.dish`)).not.toBeInTheDocument()
    expect(screen.getByTestId(`items.0.amount`)).toHaveClass('is-valid')
  })
})

test('display an error on submitting without time and date order and booking is checked', async () => {
  render(
    <OrderForm
      order={order}
      saveOrder={saveOrder}
      confirmOrder={confirmOrder}
      searchCustomerForm={searchCustomerForm}
    />
  )

  userEvent.type(screen.getByLabelText(/Nome/), 'John')
  userEvent.type(screen.getByLabelText(/Cognome/), 'Doe')
  userEvent.type(screen.getByLabelText(/Indirizzo \*/), 'Via delle vie')
  userEvent.type(screen.getByLabelText(/Recapito Telefonico \*/), '06 3432423')
  userEvent.type(screen.getByLabelText(/Note/), 'Notes')

  await selectEvent.select(screen.getByLabelText(/Portata/), [options[0].name])
  userEvent.clear(screen.getByPlaceholderText('Inserisci la quantità'))
  userEvent.type(screen.getByPlaceholderText('Inserisci la quantità'), '2')

  userEvent.click(screen.getByLabelText(/Prenotazione/))

  userEvent.clear(
    screen.getByPlaceholderText('Inserisci la data di prenotazione')
  )

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveOrder).not.toHaveBeenCalled()
    expect(screen.getByTestId('name')).toHaveClass('is-valid')
    expect(screen.getByTestId('surname')).toHaveClass('is-valid')
    expect(screen.getByTestId('address')).toHaveClass('is-valid')
    expect(screen.getByTestId('phone')).toHaveClass('is-valid')

    expect(
      screen.getByPlaceholderText('Inserisci la data di prenotazione')
    ).toHaveClass('is-invalid')
    expect(screen.getByTestId('time')).toHaveClass('is-invalid')

    expect(screen.getByTestId('notes')).toHaveClass('is-valid')

    expect(screen.queryByTestId(`items.0.dish`)).not.toBeInTheDocument()
    expect(screen.getByTestId(`items.0.amount`)).toHaveClass('is-valid')
  })
})

test('add more dish items on click add button', async () => {
  render(
    <OrderForm
      order={order}
      saveOrder={saveOrder}
      confirmOrder={confirmOrder}
      searchCustomerForm={searchCustomerForm}
    />
  )

  expect(screen.getAllByLabelText(/Portata/).length).toBe(1)

  userEvent.click(screen.getByRole('button', { name: /Aggiungi/ }))

  await waitFor(() => {
    expect(screen.getAllByLabelText(/Portata/).length).toBe(2)
  })
})

test('remove dish items on click delete', async () => {
  render(
    <OrderForm
      order={order}
      saveOrder={saveOrder}
      confirmOrder={confirmOrder}
      searchCustomerForm={searchCustomerForm}
    />
  )

  expect(screen.getAllByLabelText(/Portata/).length).toBe(1)

  userEvent.click(screen.getByRole('button', { name: /Aggiungi/ }))
  userEvent.click(screen.getByRole('button', { name: /Aggiungi/ }))

  expect(screen.getAllByLabelText(/Portata/).length).toBe(3)

  userEvent.click(screen.getAllByRole('button', { name: /Rimuovi/ })[0])

  await waitFor(() => {
    expect(screen.getAllByLabelText(/Portata/).length).toBe(2)
  })
})
