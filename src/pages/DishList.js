import { useState, useEffect } from 'react'
import { Alert, Button } from 'react-bootstrap'

import DishTableList from '../components/DishTableList'

import { useHistory } from 'react-router-dom'

function DishList() {
  const history = useHistory()

  const [dishList, setDishList] = useState([])

  useEffect(() => {
    const getDishList = async () => {
      let dishList = await window?.api?.getDishList()
      setDishList(dishList || [])
    }

    getDishList()
  }, [])

  const insertDish = (e) => {
    e.preventDefault()
    history.push(`/insert-dish-item`)
  }

  const updateDish = (dish) => {
    history.push(`/update-dish-item/${dish._id}`)
  }

  const removeDish = async (dish) => {
    await window?.api?.removeDish(dish)
    setDishList(dishList.filter((item) => item._id !== dish._id))
  }

  return (
    <div className="mt-4">
      <h1>
        {' '}
        <i className="fas fa-users"></i> Lista Portate{' '}
      </h1>

      {dishList.length > 0 ? (
        <DishTableList
          dishList={dishList}
          updateDish={updateDish}
          removeDish={removeDish}></DishTableList>
      ) : (
        <Alert variant="primary" className="mt-5">
          <Alert.Heading>Nessuna portata è stata ancora aggiunta</Alert.Heading>
          <p>Clicca sul pulsante in basso per aggiungere una nuova portata.</p>

          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={insertDish} variant="outline-primary">
              <i className="fas fa-plus"></i> Nuova Portata
            </Button>
          </div>
        </Alert>
      )}
    </div>
  )
}

export { DishList }

export default DishList
