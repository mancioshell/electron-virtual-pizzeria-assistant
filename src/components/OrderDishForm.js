import { useState, useEffect } from 'react'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { Field } from 'formik'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

const OrderDishForm = ({ index, remove, items }) => {
  const [options, setOptions] = useState([])

  const { t } = useTranslation(['order-dish-form'])

  useEffect(() => {
    const getOptions = async () => {
      let optionList = await window?.api?.getDishList()
      setOptions(
        optionList.map((dish) => ({ label: dish.name, value: dish._id })) || []
      )
    }
    getOptions()
    return () => {
      setOptions([])
    }
  }, [])

  return (
    <Row className="mb-3">
      <Col sm="6" md="8" lg="8">
        <Field name={`items.${index}.dish`}>
          {({ field, form, meta }) => {
            const isValid = form.submitCount > 0 && meta.touched && !meta.error
            const isInvalid = form.submitCount > 0 && meta.touched && meta.error
            return (
              <Form.Group controlId={`items.${index}.dish`}>
                <Form.Label>
                  <b>{t('dish.label')} *</b> :
                </Form.Label>
                <Select
                  inputId={`items.${index}.dish`}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: isValid
                        ? '#28a745;'
                        : isInvalid
                        ? '#dc3545;'
                        : provided.borderColor
                    })
                  }}
                  options={options.filter(
                    (option) =>
                      items.filter((item) => item.dish === option.value)
                        .length <= 0
                  )}
                  isSearchable={true}
                  name={field.name}
                  value={
                    options.find((option) => option.value === field.value) ||
                    null
                  }
                  onChange={(option) => {
                    form.setFieldValue(
                      field.name,
                      option === null ? '' : option.value
                    )
                  }}
                  required
                  placeholder={t('dish.placeholder')}
                />

                {isInvalid ? (
                  <span
                    className="manual-invalid-feedback"
                    data-testid={`items.${index}.dish`}>
                    {t('dish.feedback')}
                  </span>
                ) : null}
              </Form.Group>
            )
          }}
        </Field>
      </Col>
      <Col sm="3" md="2" lg="2">
        <Field name={`items.${index}.amount`}>
          {({ field, form, meta }) => (
            <Form.Group controlId="number">
              <Form.Label>
                <b>{t('amount.label')} *</b> :
              </Form.Label>
              <Form.Control
                type="number"
                name={`items.${index}.amount`}
                min="1"
                {...field}
                data-testid={`items.${index}.amount`}
                isValid={form.submitCount > 0 && meta.touched && !meta.error}
                isInvalid={form.submitCount > 0 && meta.touched && meta.error}
                required
                placeholder={t('amount.placeholder')}
              />
              <Form.Control.Feedback type="invalid">
                {t('amount.feedback')}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </Field>
      </Col>

      {items.length > 1 ? (
        <Col sm="3" md="2" lg="2" className="align-self-center">
          <Button
            variant="danger"
            className="mt-3"
            type="button"
            size="sm"
            onClick={(e) => remove(index)}>
            <i className="fas fa-trash"></i> {t('button.remove')}
          </Button>
        </Col>
      ) : null}
    </Row>
  )
}

export default OrderDishForm
