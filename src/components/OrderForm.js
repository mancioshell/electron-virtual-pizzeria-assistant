import { Form, Row, Col, Button } from 'react-bootstrap'
import React from 'react'

import { Formik, FieldArray, Field } from 'formik'
import * as yup from 'yup'

import DatePicker from 'react-datepicker'
import OrderDishForm from './OrderDishForm'
import { CustomerInputForm, customerSchema } from './CustomerForm'

import BlockUi from 'react-block-ui'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['order-form'])

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
                <i className="fas fa-bars"></i> {t('title')}
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
                              <b>{t('booking.label')}</b>
                            </Form.Label>
                            <Form.Switch
                              id="custom-switch"
                              checked={field.value}
                              {...field}
                              label={t('booking.label')}
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
                                  <b>{t('booking.hour.label')}</b> :
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
                                  placeholder={t('booking.hour.placeholder')}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t('booking.hour.feedback')}
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
                                  <b>{t('booking.date.label')}</b> :
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
                                  placeholderText={t(
                                    'booking.date.placeholder'
                                  )}></DatePicker>

                                {form.submitCount > 0 &&
                                meta.touched &&
                                meta.error ? (
                                  <span className="manual-invalid-feedback">
                                    {t('booking.date.feedback')}
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
                          <b>{t('note.label')}</b> :
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
                          placeholder={t('note.placeholder')}
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
                              <i className="fas fa-clipboard-list"></i>{' '}
                              {t('dish-list.label')}
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
                                <i className="fas fa-plus"></i>{' '}
                                {t('dish-list.button')}
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
              <i className="fas fa-save"></i> {t('button.save')}
            </Button>

            <Button
              className="mr-3"
              variant="success"
              type="button"
              onClick={() => {
                formik.setFieldValue('confirm', 1, false)
                formik.handleSubmit()
              }}>
              <i className="fas fa-check"></i> {t('button.confirm')}
            </Button>
          </Form>
        </BlockUi>
      )}
    </Formik>
  )
}

export default OrderForm
