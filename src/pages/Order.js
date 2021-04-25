import { Row, Col, Card, Button } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'

import DishList from '../components/DishList'

import { useParams, useHistory } from 'react-router-dom'

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

  const [order, setOrder] = useState(initOrder)
  const [dishItems, setDishItems] = useState([])
  const [total, setTotal] = useState([])

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

  const printReceipt = () => {
    window?.api?.printReceipt(order)
  }

  const orderList = (e) => {
    e.preventDefault()
    history.push('/order-list')
  }

  return (
    <Card border="secondary">
      <Card.Header as="h5">
        {' '}
        <i className="fas fa-pizza-slice"></i> Ordine Numero: {order._id}
      </Card.Header>
      <Card.Body>
        <Card.Title>
          {order.customer.name} {order.customer.surname}
        </Card.Title>
        {order.booking ? (
          <Card.Subtitle className="mb-2 text-muted">
            Prenotazione
          </Card.Subtitle>
        ) : null}

        <Card.Text className="mt-4">
          <strong>Indirizzo:</strong> {order.customer.address}
        </Card.Text>
        <Card.Text>
          <strong>Reacapito Telefonico:</strong> {order.customer.phone}
        </Card.Text>

        {order.booking ? (
          <>
            <Card.Text>
              <strong>Data Prenotazione:</strong>{' '}
              {order.date.toLocaleDateString()}
            </Card.Text>

            <Card.Text>
              <strong>Orario Prenotazione:</strong> {order.time}
            </Card.Text>
          </>
        ) : null}

        <hr />

        <Card.Text>
          <strong>Note:</strong> {order.notes}
        </Card.Text>

        <Card.Text as="h4" className="mt-5">
          <strong>Riepilogo Ordine:</strong>
        </Card.Text>

        <DishList items={dishItems}></DishList>

        <Row>
          <Col>
            <span className="float-right">
              <Card.Text className="float-right">
                <strong>Importo da Pagare: </strong> &#8364; {total}
              </Card.Text>
            </span>
          </Col>
        </Row>

        <hr />

        <Button className="mr-2 mb-2" variant="info" onClick={printReceipt}>
          <i className="fas fa-print"></i> Stampa{' '}
        </Button>
        <Button className="mr-2 mb-2" variant="primary" onClick={orderList}>
          <i className="fas fa-clipboard-list"></i> Lista Ordini{' '}
        </Button>
      </Card.Body>
    </Card>
  )
}

export { Order }

export default Order
