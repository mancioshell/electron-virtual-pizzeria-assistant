import { Row, Col, Form, Button, Spinner } from 'react-bootstrap'

import React, { useState, useEffect } from 'react'

import { Formik, Field } from 'formik'
import * as yup from 'yup'

import BlockUi from 'react-block-ui'

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    address: yup.string().required(),
    cap: yup.string().required(),
    phone: yup.string().required(),
    choice: yup.mixed().oneOf(['network', 'usb']).required(),
    usb: yup.string().when('choice', {
      is: 'usb',
      then: yup.string().required(),
      otherwise: yup.string()
    }),
    network: yup.object().when('choice', {
      is: 'network',
      then: yup
        .object()
        .shape({
          address: yup.string().required(),
          port: yup.number().required()
        })
        .required(),
      otherwise: yup.object().shape({
        address: yup.string(),
        port: yup.number()
      })
    })
  })
  .required()

function SettingsInputForm({ choice, options }) {
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
        <i className="fas fa-wifi"></i> Connessione Stampante Termica
      </h4>
      <hr />

      <Row>
        <Col md="2">
          <Field name={`choice`}>
            {({ field, form, meta }) => {
              return (
                <Form.Group controlId="choice">
                  <Form.Check
                    inline
                    name={field.name}
                    id="custom-radio-network"
                    data-testid="custom-radio-network"
                    type="radio"
                    checked={field.value === 'network'}
                    label="Network"
                    value="network"
                    onChange={field.onChange}
                  />
                  <Form.Check
                    inline
                    name={field.name}
                    data-testid="custom-radio-usb"
                    id="custom-radio-usb"
                    type="radio"
                    checked={field.value === 'usb'}
                    label="USB"
                    value="usb"
                    onChange={field.onChange}
                  />
                </Form.Group>
              )
            }}
          </Field>
        </Col>
      </Row>

      {choice === 'network' ? (
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
      ) : (
        <Row>
          <Col md="12">
            <Field name={`usb`}>
              {({ field, form, meta }) => {
                return (
                  <Form.Group controlId={`usb-printers`}>
                    <Form.Label>
                      <b>Stampante *</b> :
                    </Form.Label>

                    <Form.Control
                      as="select"
                      custom
                      value={field.value}
                      onChange={(e) => {
                        form.setFieldValue(
                          field.name,
                          e.target.value === null ? '' : e.target.value
                        )
                      }}
                      required
                      placeholder="Seleziona la stampante ...">
                      <>
                        <option value=""></option>

                        {options.map((type) => (
                          <option
                            data-testid="usb-printer-options"
                            key={type.label}
                            value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      La selezione della stampante è obbligatoria
                    </Form.Control.Feedback>
                  </Form.Group>
                )
              }}
            </Field>
          </Col>
        </Row>
      )}
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
  const [options, setOptions] = useState([])

  useEffect(() => {
    const getOptions = async () => {
      let optionList = await window?.api?.findUSBPrinter()
      setOptions(optionList)
    }
    getOptions()
    return () => {
      setOptions([])
    }
  }, [])

  const resetForm = (actions) => (order) => {
    actions.resetForm({ values: order })
    actions.setSubmitting(false)
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...settings }}
      validationSchema={schema}
      onSubmit={(values, actions) => {
        const { usb, network, ...rest } = values
        const savedValues =
          values.choice === 'network'
            ? { ...rest, network, usb: '' }
            : { ...rest, usb, network: { address: '', port: 9100 } }
        saveSettings(savedValues, resetForm(actions))
      }}>
      {(formik) => (
        <BlockUi tag="div" blocking={formik.isSubmitting}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <CompanyInputForm></CompanyInputForm>
            <SettingsInputForm
              options={options}
              choice={formik.values.choice}></SettingsInputForm>

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

export { SettingsForm }

export default SettingsForm
