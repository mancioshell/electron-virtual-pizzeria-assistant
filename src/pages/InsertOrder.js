import React, { useState, useEffect, useContext } from 'react'
import UIContext from '../context/UIContext'

import OrderForm from '../components/OrderForm'

import SearchCustomerForm from '../components/SearchCustomerForm'

import { useHistory } from 'react-router-dom'

import { useParams } from 'react-router-dom'

const SearchCustomerFormRef = React.forwardRef((props, ref) => {
  return <SearchCustomerForm {...props} forwardedRef={ref} />
})

const ref = React.createRef()

const initOrder = {
  customer: {
    name: '',
    surname: '',
    address: '',
    phone: ''
  },
  notes: '',
  time: '00:00',
  date: new Date(),
  items: [
    {
      dish: '',
      amount: 1
    }
  ],
  booking: false
}

function InsertOrder() {
  const history = useHistory()

  let { id, customerId } = useParams()
  const [order, setOrder] = useState(initOrder)

  const { addSuccessMessage } = useContext(UIContext)

  useEffect(() => {
    const getCurrentOrder = async () => {
      let currentOrder = await window?.api?.getOrderById(id)
      setOrder(currentOrder)
    }

    const getCurrentCustomer = async () => {
      let customer = await window?.api?.getCustomerById(customerId)
      setOrder({ ...initOrder, customer })
    }

    if (id) getCurrentOrder()
    if (customerId) getCurrentCustomer()
    if (!id && !customerId) setOrder(initOrder)
  }, [id, customerId])

  const saveOrder = async (savedOrder, resetForm) => {
    let current = await window?.api?.insertOrder(savedOrder)
    setOrder((state) => {
      return { ...state, ...current }
    })
    resetForm(order)

    addSuccessMessage({
      text: 'Ordine salvato con successo',
      type: 'Ordine',
      show: true
    })
  }

  const confirmOrder = async (confirmedOrder, resetForm) => {
    await window?.api?.insertOrder(confirmedOrder)

    if (id) history.push(`/order-list`)
    if (!id) {
      resetForm(initOrder)
      ref.current.clear()
    }

    addSuccessMessage({
      text: 'Ordine confermato con successo',
      type: 'Ordine',
      show: true
    })
  }

  return (
    <div id="container">
      <header className="mt-4">
        <h1>
          {' '}
          {id ? (
            <>
              <i className="fas fa-pencil-alt"></i> Modifica Ordine
            </>
          ) : (
            <>
              <i className="fas fa-plus"></i> Inserisci Nuovo Ordine
            </>
          )}{' '}
        </h1>
      </header>

      <section className="mt-5" id="formsContainer">
        <h3>
          {' '}
          <i className="fas fa-user"></i> Cliente{' '}
        </h3>

        <hr className="mt-2"></hr>

        <OrderForm
          order={order}
          saveOrder={saveOrder}
          confirmOrder={confirmOrder}
          searchCustomerForm={(formik) => {
            return (
              <SearchCustomerFormRef
                ref={ref}
                onChangeCustomer={(customer) =>
                  formik.setFieldValue('customer', customer)
                }
              />
            )
          }}
        />
      </section>
    </div>
  )
}

export { InsertOrder }

export default InsertOrder
