import { Row, Col, Form, Button } from 'react-bootstrap'

import React from 'react'

import { Formik, Field } from 'formik'
import * as yup from 'yup'

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    description: yup.string(),
    price: yup.number().required()
  })
  .required()

function DishItemInputForm() {
  return (
    <section className="mt-5" id="customer">
      <Row>
        <Col>
          <Field name={`name`}>
            {({ field, form, meta }) => {
              return (
                <Form.Group controlId="name">
                  <Form.Label>
                    <b>Nome *</b> :
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
                    placeholder="Inserisci il nome"
                  />
                  <Form.Control.Feedback type="invalid">
                    Il nome è obbligatorio
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
                  <b>Prezzo Unitario (&#8364;) *</b> :
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  {...field}
                  data-testid="price"
                  isValid={form.submitCount > 0 && meta.touched && !meta.error}
                  isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                  required
                  placeholder="Inserisci il prezzo unitario"
                />
                <Form.Control.Feedback type="invalid">
                  Il prezzo è obbligatorio
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
                <b>Descrizione</b> :
              </Form.Label>
              <Form.Control
                as="textarea"
                {...field}
                data-testid="description"
                isValid={form.submitCount > 0 && meta.touched && !meta.error}
                isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                placeholder="Inserisci la descrizione"
              />
            </Form.Group>
          )
        }}
      </Field>
    </section>
  )
}

function DishItemForm({ dish, saveDish }) {
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
        <Form noValidate onSubmit={formik.handleSubmit}>
          <DishItemInputForm></DishItemInputForm>

          <hr className="mt-2"></hr>

          <Button className="mr-3" variant="primary" type="submit">
            <i className="fas fa-save"></i> Salva
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export { DishItemForm }

export default DishItemForm
