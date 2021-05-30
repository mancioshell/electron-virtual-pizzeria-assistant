import { Form, Button } from 'react-bootstrap'
import React from 'react'

import { Formik, Field } from 'formik'
import * as yup from 'yup'

import BlockUi from 'react-block-ui'

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
  return (
    <section className="mt-5" id="customer">
      <Field name={`customer.name`}>
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
                isValid={form.submitCount > 0 && meta.touched && !meta.error}
                isInvalid={form.submitCount > 0 && meta.touched && meta.error}
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

      <Field name={`customer.surname`}>
        {({ field, form, meta }) => (
          <Form.Group controlId="surname">
            <Form.Label>
              <b>Cognome *</b> :
            </Form.Label>
            <Form.Control
              type="text"
              {...field}
              data-testid="surname"
              isValid={form.submitCount > 0 && meta.touched && !meta.error}
              isInvalid={form.submitCount > 0 && meta.touched && meta.error}
              required
              placeholder="Inserisci il cognome"
            />
            <Form.Control.Feedback type="invalid">
              Il cognome è obbligatorio
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Field>

      <Field name={`customer.address`}>
        {({ field, form, meta }) => (
          <Form.Group controlId="address">
            <Form.Label>
              <b>Indirizzo *</b> :
            </Form.Label>
            <Form.Control
              type="text"
              {...field}
              data-testid="address"
              isValid={form.submitCount > 0 && meta.touched && !meta.error}
              isInvalid={form.submitCount > 0 && meta.touched && meta.error}
              required
              placeholder="Inserisci l'indirizzo"
            />
            <Form.Control.Feedback type="invalid">
              L'indirizzo è obbligatorio
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Field>

      <Field name={`customer.phone`}>
        {({ field, form, meta }) => {
          return (
            <Form.Group controlId="number">
              <Form.Label>
                <b>Recapito Telefonico *</b> :
              </Form.Label>
              <Form.Control
                type="text"
                {...field}
                data-testid="phone"
                isValid={form.submitCount > 0 && meta.touched && !meta.error}
                isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                required
                placeholder="Inserisci il recapito telefonico"
              />
              <Form.Control.Feedback type="invalid">
                Il recapito telefonico è obbligatorio
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
              <i className="fas fa-save"></i> Salva
            </Button>
          </Form>
        </BlockUi>
      )}
    </Formik>
  )
}

export { CustomerInputForm, CustomerForm, customerSchema }

export default CustomerForm
