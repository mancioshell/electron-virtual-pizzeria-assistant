import { Form, Row, Col, Button } from 'react-bootstrap'
import React from 'react'

import { Formik, FieldArray, Field } from 'formik'
import * as yup from 'yup'

import DatePicker from 'react-datepicker'
import OrderDishForm from './OrderDishForm'
import { CustomerInputForm, customerSchema } from './CustomerForm'

import BlockUi from 'react-block-ui'

import './OrderForm.css'

const schema = yup.object().shape({
  customer: customerSchema,
  booking: yup.boolean().required(),
  time: yup.string().when('booking', {
    is: true,
    then: yup
      .string()
      .matches(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/gi)
      .required(),
    otherwise: yup.string()
  }),
  date: yup.date().when('booking', {
    is: true,
    then: yup.date().required(),
    otherwise: yup.date()
  }),
  items: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          dish: yup.string().required(),
          amount: yup.number().min(1).required()
        })
        .required()
    )
    .required()
})

function OrderForm({ order, saveOrder, confirmOrder, searchCustomerForm }) {
  const resetForm = (actions) => (order) => {
    actions.resetForm({ values: order })
    actions.setSubmitting(false)
  }

  return (
    <Formik
      initialValues={order}
      enableReinitialize={true}
      validationSchema={schema}
      onSubmit={(values, actions) => {
        values.confirm
          ? confirmOrder(values, resetForm(actions))
          : saveOrder(values, resetForm(actions))
      }}>
      {(formik) => (
        <BlockUi blocking={formik.isSubmitting}>
          <Form noValidate>
            {searchCustomerForm(formik)}

            <CustomerInputForm></CustomerInputForm>

            <section className="mt-5 mb-4" id="order">
              <h3>
                <i className="fas fa-bars"></i> Ordine
              </h3>
              <hr className="mt-2"></hr>

              <div className="mt-3">
                <Row className="booking">
                  <Col md="2">
                    <Field name={`booking`}>
                      {({ field, form, meta }) => {
                        return (
                          <Form.Group controlId="booking">
                            <Form.Label>
                              <b>Prenotazione</b>
                            </Form.Label>
                            <Form.Switch
                              id="custom-switch"
                              checked={field.value}
                              {...field}
                              label="Prenotazione"
                            />
                          </Form.Group>
                        )
                      }}
                    </Field>
                  </Col>

                  {formik.values.booking ? (
                    <>
                      <Col md="3">
                        <Field name={`time`}>
                          {({ field, form, meta }) => {
                            return (
                              <Form.Group controlId="time">
                                <Form.Label>
                                  <b>Orario Prenotazione</b> :
                                </Form.Label>
                                <Form.Control
                                  type="time"
                                  {...field}
                                  data-testid="time"
                                  isValid={
                                    form.submitCount > 0 &&
                                    meta.touched &&
                                    !meta.error
                                  }
                                  isInvalid={
                                    form.submitCount > 0 &&
                                    meta.touched &&
                                    meta.error
                                  }
                                  required
                                  placeholder="Inserisci l'orario di prenotazione"
                                />
                                <Form.Control.Feedback type="invalid">
                                  L'orario di prenotazione è obbligatorio
                                </Form.Control.Feedback>
                              </Form.Group>
                            )
                          }}
                        </Field>
                      </Col>

                      <Col md="4">
                        <Field name={`date`}>
                          {({ field, form, meta }) => {
                            return (
                              <Form.Group controlId="date">
                                <Form.Label>
                                  <b>Data Prenotazione</b> :
                                </Form.Label>
                                <DatePicker
                                  required
                                  className={
                                    form.submitCount > 0 && meta.touched
                                      ? !meta.error
                                        ? `form-control is-valid`
                                        : `form-control is-invalid`
                                      : `form-control`
                                  }
                                  data-testid="date"
                                  selected={field.value}
                                  onChange={(date) =>
                                    form.setFieldValue('date', date)
                                  }
                                  placeholderText="Inserisci la data di prenotazione"></DatePicker>

                                {form.submitCount > 0 &&
                                meta.touched &&
                                meta.error ? (
                                  <span className="manual-invalid-feedback">
                                    La data di prenotazione è obbligatoria
                                  </span>
                                ) : null}
                              </Form.Group>
                            )
                          }}
                        </Field>
                      </Col>
                    </>
                  ) : null}
                </Row>

                <Field name={`notes`}>
                  {({ field, form, meta }) => {
                    return (
                      <Form.Group controlId="notes">
                        <Form.Label>
                          <b>Note</b> :
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          {...field}
                          rows={3}
                          data-testid="notes"
                          isValid={
                            form.submitCount > 0 && meta.touched && !meta.error
                          }
                          isInvalid={
                            form.submitCount > 0 && meta.touched && meta.error
                          }
                          required
                          placeholder="Inserisci delle note"
                        />
                      </Form.Group>
                    )
                  }}
                </Field>

                <FieldArray
                  name="items"
                  render={(arrayHelpers) => {
                    return (
                      <>
                        <Row>
                          <Col>
                            <h4 className="mt-3">
                              <i className="fas fa-clipboard-list"></i> Portate{' '}
                            </h4>
                            <hr className="mt-2"></hr>
                          </Col>
                        </Row>
                        {formik.values.items.map((item, index) => (
                          <OrderDishForm
                            key={index}
                            index={index}
                            remove={arrayHelpers.remove}
                            items={formik.values.items}
                          />
                        ))}

                        <Row>
                          <Col>
                            <span className="btn-group float-right">
                              <Button
                                variant="dark"
                                type="button"
                                size="sm"
                                onClick={() =>
                                  arrayHelpers.push({ dish: '', amount: 1 })
                                }>
                                <i className="fas fa-plus"></i> Aggiungi
                              </Button>
                            </span>
                          </Col>
                        </Row>
                      </>
                    )
                  }}
                />
              </div>
            </section>

            <hr className="mt-2"></hr>

            <Button
              className="mr-3"
              variant="primary"
              type="button"
              onClick={() => {
                formik.setFieldValue('confirm', 0, false)
                formik.handleSubmit()
              }}>
              <i className="fas fa-save"></i> Salva
            </Button>

            <Button
              className="mr-3"
              variant="success"
              type="button"
              onClick={() => {
                formik.setFieldValue('confirm', 1, false)
                formik.handleSubmit()
              }}>
              <i className="fas fa-check"></i> Conferma
            </Button>
          </Form>
        </BlockUi>
      )}
    </Formik>
  )
}

export default OrderForm
