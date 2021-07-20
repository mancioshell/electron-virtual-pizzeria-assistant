import { Row, Col, Card, Button } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'

import DishList from '../components/OrderDishList'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BlockUi from 'react-block-ui'

const initOrder = {
  customer: {
    name: '',
    surname: '',
    address: '',
    phone: ''
  },
  time: '00:00',
  date: new Date(),
  items: [],
  booking: false
}

function Order() {
  let { id } = useParams()

  const history = useHistory()
  const { t } = useTranslation(['order'])

  const [order, setOrder] = useState(initOrder)
  const [dishItems, setDishItems] = useState([])
  const [total, setTotal] = useState([])
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    const getCurrentOrder = async () => {
      let total = 0
      let dishItemList = []

      let currentOrder = await window?.api?.getOrderById(id)

      for (let item of currentOrder.items) {
        let currentDishItem = await window?.api?.getDishById(item.dish)
        dishItemList = dishItemList.concat([
          { ...currentDishItem, amount: item.amount }
        ])
        total += item.amount * currentDishItem.price
      }

      setTotal(total)
      setDishItems(dishItemList)

      setOrder(currentOrder)
    }

    getCurrentOrder()
  }, [])

  const printReceipt = async () => {
    try {
      setIsPrinting(true)
      await window?.api?.printReceipt(order)
    } catch (error) {
      console.log(error)
    } finally {
      setIsPrinting(false)
    }
  }

  const orderList = (e) => {
    e.preventDefault()
    history.push('/order-list')
  }

  return (
    <BlockUi blocking={isPrinting}>
      <Card border="secondary">
        <Card.Header as="h5">
          {' '}
          <i className="fas fa-pizza-slice"></i> {t('label.order-number')}:{' '}
          {order._id}
        </Card.Header>
        <Card.Body>
          <Card.Title>
            {order.customer.name} {order.customer.surname}
          </Card.Title>
          {order.booking ? (
            <Card.Subtitle className="mb-2 text-muted">
              {t('label.booking')}
            </Card.Subtitle>
          ) : null}

          <Card.Text className="mt-4">
            <strong>{t('label.address')}:</strong> {order.customer.address}
          </Card.Text>
          <Card.Text>
            <strong>{t('label.phone')}:</strong> {order.customer.phone}
          </Card.Text>

          {order.booking ? (
            <>
              <Card.Text>
                <strong>{t('label.booking-date')}:</strong>{' '}
                {order.date.toLocaleDateString()}
              </Card.Text>

              <Card.Text>
                <strong>{t('label.booking-hour')}:</strong> {order.time}
              </Card.Text>
            </>
          ) : null}

          <hr />

          <Card.Text>
            <strong>{t('label.note')}:</strong> {order.notes}
          </Card.Text>

          <Card.Text as="h4" className="mt-5">
            <strong>{t('label.order-resume')}:</strong>
          </Card.Text>

          <DishList items={dishItems}></DishList>

          <Row>
            <Col>
              <span className="float-right">
                <Card.Text className="float-right">
                  <strong>{t('label.total-income')}: </strong> &#8364; {total}
                </Card.Text>
              </span>
            </Col>
          </Row>

          <hr />

          <Button className="mr-2 mb-2" variant="info" onClick={printReceipt}>
            <i className="fas fa-print"></i> {t('button.print')}
          </Button>
          <Button className="mr-2 mb-2" variant="primary" onClick={orderList}>
            <i className="fas fa-clipboard-list"></i> {t('button.order-list')}
          </Button>
        </Card.Body>
      </Card>
    </BlockUi>
  )
}

export { Order }

export default Order
