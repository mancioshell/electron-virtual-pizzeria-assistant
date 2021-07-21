import React, { useState, useEffect, useContext } from 'react'
import UIContext from '../context/UIContext'

import DishItemForm from '../components/DishItemForm'

import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const initDish = {
  name: '',
  description: '',
  price: 0
}

function InsertDish() {
  const history = useHistory()
  const { t } = useTranslation(['insert-dish-item'])

  let { id } = useParams()
  const [dish, setDish] = useState(initDish)

  const { addSuccessMessage } = useContext(UIContext)

  useEffect(() => {
    const getCurrentDish = async () => {
      let currentDish = await window?.api?.getDishById(id)
      setDish(currentDish)
    }

    if (id) getCurrentDish()
    if (!id) setDish(initDish)
  }, [id])

  const saveDish = async (savedDish, resetForm) => {
    await window?.api?.insertDish(savedDish)
    if (id) history.push(`/dish-list`)
    if (!id) resetForm(initDish)
    addSuccessMessage({
      text: t('success-message'),
      type: t('success-message-title'),
      show: true
    })
  }

  return (
    <div id="container">
      <header className="mt-4">
        <h1>
          {' '}
          {id ? (
            <>
              <i className="fas fa-pencil-alt"></i> {t('modify-title')}
            </>
          ) : (
            <>
              <i className="fas fa-plus"></i> {t('insert-title')}
            </>
          )}{' '}
        </h1>
      </header>

      <section className="mt-5" id="formsContainer">
        <h3>
          {' '}
          <i className="fas fa-pizza-slice"></i> {t('title')}
        </h3>

        <hr className="mt-2"></hr>

        <DishItemForm dish={dish} saveDish={saveDish}></DishItemForm>
      </section>
    </div>
  )
}

export { InsertDish }

export default InsertDish
