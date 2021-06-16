import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import React, { useState, useEffect } from 'react'

import { Container, Row, Col } from 'react-bootstrap'

import { Menu } from './components/Menu'
import { Footer } from './components/Footer'
import { Messages } from './components/Messages'
import { InsertOrder } from './pages/InsertOrder'
import { OrderList } from './pages/OrderList'
import { Order } from './pages/Order'
import { CustomerList } from './pages/CustomerList'
import { InsertCustomer } from './pages/InsertCustomer'
import { InsertDish } from './pages/InsertDishItem'
import { InsertSettings } from './pages/InsertSettings'
import { DishList } from './pages/DishList'
import { UIContext } from './context/UIContext'
import { IncomeHistory } from './pages/IncomeHistory'

import { SettingsContext, initSettings } from './context/SettingsContext'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-block-ui/style.css'

import './App.css'

function App() {
  const [successMessage, addSuccessMessage] = useState({
    text: '',
    type: '',
    show: false
  })

  const [settings, setSettings] = useState(initSettings)

  useEffect(() => {
    const getSettings = async () => {
      let settings = await window?.api?.getSettings()
      setSettings(settings)
    }

    getSettings()
  }, [])

  return (
    <Router>
      <SettingsContext.Provider
        value={{
          settings,
          setSettings
        }}>
        <Menu></Menu>
      </SettingsContext.Provider>

      <Container className="justify-content-md-center mt-5" fluid>
        <UIContext.Provider
          value={{
            successMessage,
            addSuccessMessage
          }}>
          <Row>
            <Col md={{ span: 4, offset: 4 }}>
              <Messages></Messages>
            </Col>
          </Row>

          <Row className="min-container">
            <Col md={{ span: 10, offset: 1 }}>
              <Switch>
                <Route path="/insert-order/customer/:customerId">
                  <InsertOrder />
                </Route>

                <Route path="/insert-order">
                  <InsertOrder />
                </Route>

                <Route path="/update-order/:id">
                  <InsertOrder />
                </Route>

                <Route path="/order-list">
                  <OrderList />
                </Route>

                <Route path="/customer-list">
                  <CustomerList />
                </Route>

                <Route path="/update-customer/:customerId">
                  <InsertCustomer />
                </Route>

                <Route path="/order/:id">
                  <Order />
                </Route>

                <Route path="/insert-dish-item">
                  <InsertDish />
                </Route>

                <Route path="/update-dish-item/:id">
                  <InsertDish />
                </Route>

                <Route path="/dish-list">
                  <DishList />
                </Route>

                <Route path="/insert-settings">
                  <SettingsContext.Provider
                    value={{
                      settings,
                      setSettings
                    }}>
                    <InsertSettings />
                  </SettingsContext.Provider>
                </Route>

                <Route path="/income-history">
                  <IncomeHistory />
                </Route>

                <Redirect to="/insert-order" />
              </Switch>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col md={{ span: 10, offset: 1 }}>
              <Footer></Footer>
            </Col>
          </Row>
        </UIContext.Provider>
      </Container>
    </Router>
  )
}

export default App
