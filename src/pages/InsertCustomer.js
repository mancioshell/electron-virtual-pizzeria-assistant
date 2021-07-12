import { Form } from 'react-bootstrap'

import React, { useState, useEffect, useContext } from 'react'

import UIContext from '../context/UIContext'

import CustomerForm from '../components/CustomerForm'
import SearchCustomerForm from '../components/SearchCustomerForm'

import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SearchCustomerFormRef = React.forwardRef((props, ref) => {
  return <SearchCustomerForm {...props} forwardedRef={ref} />
})

const ref = React.createRef()

const initCustomer = {
  name: '',
  surname: '',
  address: '',
  phone: ''
}

function InsertCustomer() {
  const { addSuccessMessage } = useContext(UIContext)

  const history = useHistory()
  const { t } = useTranslation(['insert-customer'])

  let { customerId } = useParams()
  const [customer, setCustomer] = useState(initCustomer)

  useEffect(() => {
    const getCurrentCustomer = async () => {
      let customer = await window?.api?.getCustomerById(customerId)
      setCustomer(customer)
    }

    if (customerId) getCurrentCustomer()
    if (!customerId) setCustomer(initCustomer)
  }, [customerId])

  const saveCustomer = async (customer, resetForm) => {
    await window?.api?.insertCustomer(customer)
    resetForm(initCustomer)
    history.push(`/insert-order`)

    addSuccessMessage({
      text: t('success-message'),
      type: t('success-message-title'),
      show: true
    })
  }

  const onChangeCustomer = (customer) => {
    setCustomer((state) => {
      return { ...state, ...customer }
    })
  }

  return (
    <div id="container">
      <header className="mt-4">
        <h1>
          {' '}
          <i className="fas fa-pencil-alt"></i> {t('title')}
        </h1>
      </header>

      <section className="mt-5" id="formsContainer">
        <h3> Cliente </h3>

        <hr className="mt-2"></hr>

        <Form>
          <SearchCustomerFormRef
            ref={ref}
            onChangeCustomer={onChangeCustomer}></SearchCustomerFormRef>
        </Form>

        <CustomerForm
          customer={customer}
          saveCustomer={saveCustomer}></CustomerForm>
      </section>
    </div>
  )
}

export { InsertCustomer }

export default InsertCustomer
