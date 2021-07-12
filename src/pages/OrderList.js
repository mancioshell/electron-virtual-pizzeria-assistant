import { useState, useEffect } from 'react'

import OrderTableList from '../components/OrderTableList'

import { Alert, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BlockUi from 'react-block-ui'

function OrderList() {
  const history = useHistory()
  const { t } = useTranslation(['order-list'])

  const [orderList, setOrderList] = useState([])
  const [isPrinting, setIsPrinting] = useState(false)

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
    try {
      setIsPrinting(true)
      await window?.api?.printReceipt(order)
    } catch (error) {
      console.log(error)
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <div className="mt-4">
      <h1>
        {' '}
        <i className="fas fa-clipboard-list"></i> {t('title')}
      </h1>

      {orderList.length > 0 ? (
        <BlockUi blocking={isPrinting}>
          <OrderTableList
            orderList={orderList}
            updateOrder={updateOrder}
            removeOrder={removeOrder}
            readOrder={readOrder}
            printReceipt={printReceipt}></OrderTableList>
        </BlockUi>
      ) : (
        <Alert variant="primary" className="mt-5">
          <Alert.Heading>{t('alert-heading')}</Alert.Heading>
          <p>{t('alert-body')}</p>

          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={insertOrder} variant="outline-primary">
              <i className="fas fa-plus"></i> {t('alert-button')}
            </Button>
          </div>
        </Alert>
      )}
    </div>
  )
}

export { OrderList }

export default OrderList
