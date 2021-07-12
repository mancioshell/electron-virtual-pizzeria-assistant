import { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'

import CustomerTableList from '../components/CustomerTableList'

import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function CustomerList() {
  const history = useHistory()
  const { t } = useTranslation(['customer-list'])

  const [customerList, setCustomerList] = useState([])

  useEffect(() => {
    const getCustomerList = async () => {
      let customers = await window?.api?.getCustomerList()
      setCustomerList(customers || [])
    }

    getCustomerList()
  }, [])

  const updateCustomer = (customer) => {
    history.push(`/update-customer/${customer._id}`)
  }

  const createOrder = async (customer) => {
    history.push(`/insert-order/customer/${customer._id}`)
  }

  return (
    <div className="mt-4">
      <h1>
        {' '}
        <i className="fas fa-users"></i> {t('title')}
      </h1>

      {customerList.length > 0 ? (
        <CustomerTableList
          customerList={customerList}
          updateCustomer={updateCustomer}
          createOrder={createOrder}></CustomerTableList>
      ) : (
        <Alert variant="primary" className="mt-5">
          <Alert.Heading>{t('alert-heading')}</Alert.Heading>
          <p>{t('alert-body')}</p>
        </Alert>
      )}
    </div>
  )
}

export { CustomerList }

export default CustomerList
