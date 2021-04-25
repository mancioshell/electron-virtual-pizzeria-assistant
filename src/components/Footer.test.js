import React from 'react'

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Footer from './Footer'

test('loads and displays footer', async () => {
  render(<Footer />)
  let anchor = screen.getByText('mancioshell')
  expect(anchor).toHaveAttribute('href', 'https://github.com/mancioshell')
})
