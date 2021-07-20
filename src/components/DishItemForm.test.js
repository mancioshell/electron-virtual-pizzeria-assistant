import React from 'react'

import { waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DishItemForm from './DishItemForm'
import userEvent from '@testing-library/user-event'

import i18NextCustomRender from '../i18n.test'
import config from '../../public/locales/it/dish-item-form.json'

let dish = { name: '', description: '', price: 0 }
let saveDish

const customRender = (ui, renderOptions) =>
  i18NextCustomRender(ui, { ...config }, renderOptions)

beforeEach(() => {
  saveDish = jest.fn()
})

afterEach(() => {
  saveDish.mockRestore()
})

test('rendering and submitting a DishItemForm with description', async () => {
  customRender(<DishItemForm dish={dish} saveDish={saveDish} />)

  userEvent.type(screen.getByLabelText(/Nome/), 'Pizza Margherita')
  userEvent.type(screen.getByLabelText(/Prezzo Unitario/), '2')
  userEvent.type(screen.getByLabelText(/Descrizione/), 'La Pizza Margherita')

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveDish).toHaveBeenCalledWith(
      {
        name: 'Pizza Margherita',
        description: 'La Pizza Margherita',
        price: 2
      },
      expect.anything()
    )
  })
})

test('rendering and submitting a DishItemForm without description', async () => {
  customRender(<DishItemForm dish={dish} saveDish={saveDish} />)

  userEvent.type(screen.getByLabelText(/Nome/), 'Pizza Margherita')
  userEvent.type(screen.getByLabelText(/Prezzo Unitario/), '2')

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveDish).toHaveBeenCalledWith(
      {
        name: 'Pizza Margherita',
        description: '',
        price: 2
      },
      expect.anything()
    )
  })
})

test('display an error on submitting', async () => {
  customRender(<DishItemForm dish={dish} saveDish={saveDish} />)

  userEvent.click(screen.getByRole('button', { name: /Salva/ }))

  await waitFor(() => {
    expect(saveDish).not.toHaveBeenCalled()
    expect(screen.getByTestId('name')).toHaveClass('is-invalid')
    expect(screen.getByTestId('description')).toHaveClass('is-valid')
    expect(screen.getByTestId('price')).toHaveClass('is-valid')
  })
})
