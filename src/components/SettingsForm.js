import { Row, Col, Form, Button, Spinner } from 'react-bootstrap'

import React, { useState } from 'react'

import { Formik, Field } from 'formik'
import * as yup from 'yup'

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    address: yup.string().required(),
    cap: yup.string().required(),
    phone: yup.string().required(),
    network: yup
      .object()
      .shape({
        address: yup.string().required(),
        port: yup.number().required()
      })
      .required()
  })
  .required()

function SettingsInputForm() {
  const [connection, setConnection] = useState(undefined)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    console.log('Connection...')
    try {
      setLoading(true)
      await window?.api?.testConnection()
      console.log('Ok')
      setConnection(true)
    } catch (error) {
      console.log('Error')
      setConnection(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-5" id="settings">
      <h4>
        {' '}
        <i className="fas fa-wifi"></i> Connessione POS{' '}
      </h4>
      <hr />

      <Row>
        <Col md="2">
          <Field name={`network.address`}>
            {({ field, form, meta }) => {
              return (
                <Form.Group controlId="network-address">
                  <Form.Label>
                    <b>Indirizzo IP *</b> :
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...field}
                    data-testid="network-address"
                    isValid={
                      form.submitCount > 0 && meta.touched && !meta.error
                    }
                    isInvalid={
                      form.submitCount > 0 && meta.touched && meta.error
                    }
                    required
                    placeholder="Inserisci l'indirizzo ip del POS"
                  />
                  <Form.Control.Feedback type="invalid">
                    L'indirizzo è obbligatorio
                  </Form.Control.Feedback>
                </Form.Group>
              )
            }}
          </Field>
        </Col>

        <Col md="1">
          <Field name={`network.port`}>
            {({ field, form, meta }) => {
              return (
                <Form.Group controlId="port">
                  <Form.Label>
                    <b>Porta *</b> :
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    {...field}
                    data-testid="network-port"
                    isValid={
                      form.submitCount > 0 && meta.touched && !meta.error
                    }
                    isInvalid={
                      form.submitCount > 0 && meta.touched && meta.error
                    }
                    required
                    placeholder="Inserisci la porta del POS"
                  />
                  <Form.Control.Feedback type="invalid">
                    La porta è obbligatoria
                  </Form.Control.Feedback>
                </Form.Group>
              )
            }}
          </Field>
        </Col>

        <Col md="3" className="align-self-center">
          <Button
            className="mr-3 mt-3"
            variant={
              connection === undefined || loading
                ? 'primary'
                : connection
                ? 'success'
                : 'danger'
            }
            type="button"
            onClick={testConnection}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Connessione...
              </>
            ) : (
              <>
                <i className="fas fa-wifi"></i> Test{' '}
                {connection === undefined || loading
                  ? ''
                  : connection
                  ? 'Ok'
                  : 'Fallito'}
              </>
            )}
          </Button>
        </Col>
      </Row>
    </section>
  )
}

function CompanyInputForm() {
  return (
    <section className="mt-5" id="settings">
      <h4>
        {' '}
        <i className="fas fa-building"></i> Azienda{' '}
      </h4>
      <hr />

      <Row>
        <Col>
          <Field name={`name`}>
            {({ field, form, meta }) => {
              return (
                <Form.Group controlId="name">
                  <Form.Label>
                    <b>Nome Pizzeria *</b> :
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
                    placeholder="Inserisci il nome della pizzeria"
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
          <Field name={`address`}>
            {({ field, form, meta }) => {
              return (
                <Form.Group controlId="address">
                  <Form.Label>
                    <b>Indirizzo *</b> :
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...field}
                    data-testid="address"
                    isValid={
                      form.submitCount > 0 && meta.touched && !meta.error
                    }
                    isInvalid={
                      form.submitCount > 0 && meta.touched && meta.error
                    }
                    required
                    placeholder="Inserisci l'indirizzo"
                  />
                  <Form.Control.Feedback type="invalid">
                    L'indirizzo è obbligatorio
                  </Form.Control.Feedback>
                </Form.Group>
              )
            }}
          </Field>
        </Col>
      </Row>

      <Row>
        <Col>
          <Field name={`cap`}>
            {({ field, form, meta }) => {
              return (
                <Form.Group controlId="cap">
                  <Form.Label>
                    <b>Cap *</b> :
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...field}
                    data-testid="cap"
                    isValid={
                      form.submitCount > 0 && meta.touched && !meta.error
                    }
                    isInvalid={
                      form.submitCount > 0 && meta.touched && meta.error
                    }
                    required
                    placeholder="Inserisci cap"
                  />
                  <Form.Control.Feedback type="invalid">
                    Il cap è obbligatorio
                  </Form.Control.Feedback>
                </Form.Group>
              )
            }}
          </Field>
        </Col>

        <Col>
          <Field name={`city`}>
            {({ field, form, meta }) => (
              <Form.Group controlId="city">
                <Form.Label>
                  <b>Città *</b> :
                </Form.Label>
                <Form.Control
                  type="text"
                  {...field}
                  data-testid="city"
                  isValid={form.submitCount > 0 && meta.touched && !meta.error}
                  isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                  required
                  placeholder="Inserisci la città"
                />
                <Form.Control.Feedback type="invalid">
                  La città è obbligatoria
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Field>
        </Col>

        <Col>
          <Field name={`phone`}>
            {({ field, form, meta }) => (
              <Form.Group controlId="phone">
                <Form.Label>
                  <b>Telefono *</b> :
                </Form.Label>
                <Form.Control
                  type="text"
                  {...field}
                  data-testid="phone"
                  isValid={form.submitCount > 0 && meta.touched && !meta.error}
                  isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                  required
                  placeholder="Inserisci il telefono"
                />
                <Form.Control.Feedback type="invalid">
                  Il telefono è obbligatorio
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Field>
        </Col>
      </Row>
    </section>
  )
}

function SettingsForm({ settings, saveSettings }) {
  const resetForm = (actions) => (order) => {
    actions.resetForm({ values: order })
    actions.setSubmitting(false)
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={settings}
      validationSchema={schema}
      onSubmit={(values, actions) => {
        saveSettings(values, resetForm(actions))
      }}>
      {(formik) => (
        <Form noValidate onSubmit={formik.handleSubmit}>
          <CompanyInputForm></CompanyInputForm>
          <SettingsInputForm></SettingsInputForm>

          <hr className="mt-2"></hr>

          <Button className="mr-3" variant="primary" type="submit">
            <i className="fas fa-save"></i> Salva
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export { SettingsForm }

export default SettingsForm
