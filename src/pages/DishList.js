import { useState, useEffect } from 'react'
import { Alert, Button } from 'react-bootstrap'

import DishTableList from '../components/DishTableList'

import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function DishList() {
  const history = useHistory()
  const { t } = useTranslation(['dish-list'])

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
        <i className="fas fa-pizza-slice"></i> {t('title')}
      </h1>

      {dishList.length > 0 ? (
        <DishTableList
          dishList={dishList}
          updateDish={updateDish}
          removeDish={removeDish}></DishTableList>
      ) : (
        <Alert variant="primary" className="mt-5">
          <Alert.Heading>{t('alert-heading')}</Alert.Heading>
          <p>{t('alert-body')}</p>

          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={insertDish} variant="outline-primary">
              <i className="fas fa-plus"></i> {t('alert-button')}
            </Button>
          </div>
        </Alert>
      )}
    </div>
  )
}

export { DishList }

export default DishList
