import { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'

import CustomerTableList from '../components/CustomerTableList'

import { useHistory } from 'react-router-dom'

function CustomerList() {
  const history = useHistory()

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
        <i className="fas fa-users"></i> Lista Clienti{' '}
      </h1>

      {customerList.length > 0 ? (
        <CustomerTableList
          customerList={customerList}
          updateCustomer={updateCustomer}
          createOrder={createOrder}></CustomerTableList>
      ) : (
        <Alert variant="primary" className="mt-5">
          <Alert.Heading>Nessun cliente è stato ancora aggiunto</Alert.Heading>
          <p>
            I clienti vengono aggiunti automaticamente, quando viene effettuato
            il salvataggio di un nuovo ordine.
          </p>
        </Alert>
      )}
    </div>
  )
}

export { CustomerList }

export default CustomerList
