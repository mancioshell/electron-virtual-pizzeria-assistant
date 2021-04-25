import { useState, useEffect } from 'react'

import OrderTableList from '../components/OrderTableList'

import { Alert, Button } from 'react-bootstrap'

import { useHistory } from 'react-router-dom'

function OrderList() {
  const history = useHistory()

  const [orderList, setOrderList] = useState([])

  useEffect(() => {
    const getOrderList = async () => {
      let orders = await window?.api?.getOrderList()
      setOrderList(orders || [])
    }

    getOrderList()
  }, [])

  const insertOrder = (e) => {
    e.preventDefault()
    history.push(`/insert-order`)
  }

  const updateOrder = (e, order) => {
    e.preventDefault()
    history.push(`/update-order/${order._id}`)
  }

  const readOrder = (e, order) => {
    e.preventDefault()
    history.push(`/order/${order._id}`)
  }

  const removeOrder = async (e, order) => {
    e.preventDefault()
    await window?.api?.removeOrder(order)
    setOrderList(orderList.filter((item) => item._id !== order._id))
  }

  const printReceipt = async (order) => {
    await window?.api?.printReceipt(order)
  }

  return (
    <div className="mt-4">
      <h1>
        {' '}
        <i className="fas fa-clipboard-list"></i> Lista Ordini{' '}
      </h1>

      {orderList.length > 0 ? (
        <OrderTableList
          orderList={orderList}
          updateOrder={updateOrder}
          removeOrder={removeOrder}
          readOrder={readOrder}
          printReceipt={printReceipt}></OrderTableList>
      ) : (
        <Alert variant="primary" className="mt-5">
          <Alert.Heading>Nessun ordine è stato ancora aggiunto</Alert.Heading>
          <p>Clicca sul pulsante in basso per aggiungere un nuovo ordine.</p>

          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={insertOrder} variant="outline-primary">
              <i className="fas fa-plus"></i> Nuovo Ordine
            </Button>
          </div>
        </Alert>
      )}
    </div>
  )
}

export { OrderList }

export default OrderList
