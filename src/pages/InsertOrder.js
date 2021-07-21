import React, { useState, useEffect, useContext } from 'react'
import UIContext from '../context/UIContext'

import OrderForm from '../components/OrderForm'

import SearchCustomerForm from '../components/SearchCustomerForm'

import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['insert-order'])

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
      text: t('success-save-message'),
      type: t('success-save-message-title'),
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
      text: t('success-confirm-message'),
      type: t('success-confirm-message-title'),
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
              <i className="fas fa-pencil-alt"></i> {t('modify-title')}
            </>
          ) : (
            <>
              <i className="fas fa-plus"></i> {t('insert-title')}
            </>
          )}{' '}
        </h1>
      </header>

      <section className="mt-5" id="formsContainer">
        <h3>
          <i className="fas fa-user"></i> {t('title')}
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
