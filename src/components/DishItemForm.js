import { Row, Col, Form, Button } from 'react-bootstrap'

import React from 'react'

import { Formik, Field } from 'formik'
import * as yup from 'yup'

import BlockUi from 'react-block-ui'
import { useTranslation } from 'react-i18next'

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    description: yup.string(),
    price: yup.number().required()
  })
  .required()

function DishItemInputForm() {
  const { t } = useTranslation(['dish-item-form'])

  return (
    <section className="mt-5" id="customer">
      <Row>
        <Col>
          <Field name={`name`}>
            {({ field, form, meta }) => {
              return (
                <Form.Group controlId="name">
                  <Form.Label>
                    <b>{t('name.label')} *</b> :
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...field}
                    data-testid="name"
                    isValid={
                      form.submitCount > 0 && meta.touched && !meta.error
                    }
                    isInvalid={
                      form.submitCount > 0 && meta.touched && meta.error
                    }
                    required
                    placeholder={t('name.placeholder')}
                  />
                  <Form.Control.Feedback type="invalid">
                    {t('name.feedback')}
                  </Form.Control.Feedback>
                </Form.Group>
              )
            }}
          </Field>
        </Col>
        <Col>
          <Field name={`price`}>
            {({ field, form, meta }) => (
              <Form.Group controlId="price">
                <Form.Label>
                  <b>{t('price.label')} (&#8364;) *</b> :
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  {...field}
                  data-testid="price"
                  isValid={form.submitCount > 0 && meta.touched && !meta.error}
                  isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                  required
                  placeholder={t('price.placeholder')}
                />
                <Form.Control.Feedback type="invalid">
                  {t('price.feedback')}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Field>
        </Col>
      </Row>

      <Field name={`description`}>
        {({ field, form, meta }) => {
          return (
            <Form.Group controlId="description">
              <Form.Label>
                <b>{t('description.label')}</b> :
              </Form.Label>
              <Form.Control
                as="textarea"
                {...field}
                data-testid="description"
                isValid={form.submitCount > 0 && meta.touched && !meta.error}
                isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                placeholder={t('description.placeholder')}
              />
            </Form.Group>
          )
        }}
      </Field>
    </section>
  )
}

function DishItemForm({ dish, saveDish }) {
  const { t } = useTranslation(['dish-item-form'])

  const resetForm = (actions) => (order) => {
    actions.resetForm({ values: order })
    actions.setSubmitting(false)
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={dish}
      validationSchema={schema}
      onSubmit={(values, actions) => {
        saveDish(values, resetForm(actions))
      }}>
      {(formik) => (
        <BlockUi blocking={formik.isSubmitting}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <DishItemInputForm></DishItemInputForm>

            <hr className="mt-2"></hr>

            <Button className="mr-3" variant="primary" type="submit">
              <i className="fas fa-save"></i> {t('button')}
            </Button>
          </Form>
        </BlockUi>
      )}
    </Formik>
  )
}

export { DishItemForm }

export default DishItemForm
