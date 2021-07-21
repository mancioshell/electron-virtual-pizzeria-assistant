import { Navbar, Nav, NavDropdown } from 'react-bootstrap'

import { LinkContainer } from 'react-router-bootstrap'
import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { SettingsContext } from '../context/SettingsContext'

function Menu() {
  const history = useHistory()
  const [active, setActive] = useState('default')
  const { t } = useTranslation(['menu'])

  const { settings } = useContext(SettingsContext)

  useEffect(() => {
    return history.listen((location) => {
      const path = location.pathname.substring(1)
      const eventKey = path.startsWith('update-order') ? 'insert-order' : path
      setActive(eventKey)
    })
  }, [history])

  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/insert-order">
        <Navbar.Brand href="">
          <i className="fas fa-pizza-slice"></i> {settings.name}
        </Navbar.Brand>
      </LinkContainer>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav
          className="mr-auto"
          activeKey={active}
          onSelect={(selectedKey) => {
            setActive(selectedKey)
          }}>
          <NavDropdown
            title={
              <>
                <i className="fas fa-utensils"> </i> {t('items.order')}
              </>
            }
            id="order-nav-dropdown">
            <LinkContainer to="/insert-order">
              <NavDropdown.Item eventKey="insert-order">
                <i className="fas fa-plus"></i> {t('items.new-order')}
              </NavDropdown.Item>
            </LinkContainer>

            <LinkContainer as={NavDropdown.Item} to="/order-list">
              <NavDropdown.Item eventKey="order-list">
                <i className="fas fa-clipboard-list"></i> {t('items.order-list')}
              </NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>

          <NavDropdown
            title={
              <>
                <i className="fas fa-bars"> </i> {t('items.menu')}
              </>
            }
            id="menu-nav-dropdown">
            <LinkContainer to="/insert-dish-item">
              <NavDropdown.Item eventKey="insert-dish-item">
                <i className="fas fa-plus"></i> {t('items.new-dish')}
              </NavDropdown.Item>
            </LinkContainer>

            <LinkContainer to="/dish-list">
              <NavDropdown.Item eventKey="dish-list">
                <i className="fas fa-pizza-slice"></i> {t('items.dish-list')}
              </NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>

          <Nav.Item>
            <LinkContainer to="/customer-list">
              <Nav.Link eventKey="customer-list">
                <i className="fas fa-users"></i> {t('items.customer-list')}
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>

          <Nav.Item>
            <LinkContainer to="/income-history">
              <Nav.Link eventKey="income-history">
                <i className="fas fa-euro-sign"></i> {t('items.income-history')}
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>

          <Nav.Item>
            <LinkContainer to="/insert-settings">
              <Nav.Link eventKey="insert-settings">
                <i className="fas fa-cogs"></i> {t('items.settings')}
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export { Menu }

export default Menu
