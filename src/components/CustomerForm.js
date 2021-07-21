import { Form, Button } from 'react-bootstrap'
import React from 'react'

import { Formik, Field } from 'formik'
import * as yup from 'yup'

import BlockUi from 'react-block-ui'
import { useTranslation } from 'react-i18next'

const customerSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    address: yup.string().required(),
    phone: yup.string().required()
  })
  .required()

const schema = yup.object().shape({
  customer: customerSchema
})

function CustomerInputForm() {
  const { t } = useTranslation(['customer-form'])

  return (
    <section className="mt-5" id="customer">
      <Field name={`customer.name`}>
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
                isValid={form.submitCount > 0 && meta.touched && !meta.error}
                isInvalid={form.submitCount > 0 && meta.touched && meta.error}
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

      <Field name={`customer.surname`}>
        {({ field, form, meta }) => (
          <Form.Group controlId="surname">
            <Form.Label>
              <b>{t('surname.label')} *</b> :
            </Form.Label>
            <Form.Control
              type="text"
              {...field}
              data-testid="surname"
              isValid={form.submitCount > 0 && meta.touched && !meta.error}
              isInvalid={form.submitCount > 0 && meta.touched && meta.error}
              required
              placeholder={t('surname.placeholder')}
            />
            <Form.Control.Feedback type="invalid">
              {t('surname.feedback')}
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Field>

      <Field name={`customer.address`}>
        {({ field, form, meta }) => (
          <Form.Group controlId="address">
            <Form.Label>
              <b>{t('address.label')} *</b> :
            </Form.Label>
            <Form.Control
              type="text"
              {...field}
              data-testid="address"
              isValid={form.submitCount > 0 && meta.touched && !meta.error}
              isInvalid={form.submitCount > 0 && meta.touched && meta.error}
              required
              placeholder={t('address.placeholder')}
            />
            <Form.Control.Feedback type="invalid">
              {t('address.feedback')}
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Field>

      <Field name={`customer.phone`}>
        {({ field, form, meta }) => {
          return (
            <Form.Group controlId="number">
              <Form.Label>
                <b>{t('phone.label')} *</b> :
              </Form.Label>
              <Form.Control
                type="text"
                {...field}
                data-testid="phone"
                isValid={form.submitCount > 0 && meta.touched && !meta.error}
                isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                required
                placeholder={t('phone.placeholder')}
              />
              <Form.Control.Feedback type="invalid">
                {t('phone.feedback')}
              </Form.Control.Feedback>
            </Form.Group>
          )
        }}
      </Field>
    </section>
  )
}

function CustomerForm({ customer, saveCustomer }) {
  const resetForm = (actions) => (order) => {
    actions.resetForm({ values: order })
    actions.setSubmitting(false)
  }

  const { t } = useTranslation(['customer-form'])

  return (
    <Formik
      initialValues={{ customer }}
      enableReinitialize={true}
      validationSchema={schema}
      onSubmit={(values, actions) => {
        saveCustomer(values.customer, resetForm(actions))
      }}>
      {(formik) => (
        <BlockUi blocking={formik.isSubmitting}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <CustomerInputForm></CustomerInputForm>

            <hr className="mt-2"></hr>

            <Button className="mr-3" variant="primary" type="submit">
              <i className="fas fa-save"></i> {t('button.save')}
            </Button>
          </Form>
        </BlockUi>
      )}
    </Formik>
  )
}

export { CustomerInputForm, CustomerForm, customerSchema }

export default CustomerForm
