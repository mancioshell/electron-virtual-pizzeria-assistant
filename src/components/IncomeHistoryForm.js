import { Row, Col, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

function IncomeHistoryForm({ incomeType, setIncomeType, date, setDate }) {
  const { t } = useTranslation(['income-history-form'])

  const steps = (type, date) => {
    const steps = {
      day: 1,
      week: 7,
      month: new Date(date.getYear(), date.getMonth() + 1, 0).getDate()
    }
    return steps[type]
  }

  const prevDay = () => {
    const step = steps(incomeType, date)
    let prevDay = new Date(date)
    prevDay.setDate(date.getDate() - step)
    setDate(prevDay)
  }

  const nextDay = () => {
    const step = steps(incomeType, date)
    let nextDay = new Date(date)
    nextDay.setDate(date.getDate() + step)
    setDate(nextDay)
  }

  return (
    <Row>
      <Col md={{ span: 4 }} xs={{ span: 2 }} className="align-self-center">
        <Button className="mt-3 float-left" variant="dark" onClick={prevDay}>
          <i className="fas fa-arrow-left "></i>{' '}
          <span className="d-none d-sm-inline-block">
            &nbsp; {t('button.prev')}
          </span>
        </Button>
      </Col>
      <Col md={{ span: 4 }} xs={{ span: 8 }}>
        <Form.Group controlId="page-size">
          <Form.Label>
            <b>{t('label.income')}</b> :
          </Form.Label>
          <Form.Control
            as="select"
            custom
            value={incomeType}
            onChange={(e) => {
              setIncomeType(e.target.value)
              setDate(new Date())
            }}>
            {[
              { label: t('label.day'), value: 'day' },
              { label: t('label.week'), value: 'week' },
              { label: t('label.month'), value: 'month' }
            ].map((type) => (
              <option key={type.label} value={type.value}>
                {type.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>
      <Col md={{ span: 4 }} xs={{ span: 2 }} className="align-self-center">
        <Button className="mt-3 float-right" variant="dark" onClick={nextDay}>
          <span className="d-none d-sm-inline-block">
            {t('button.next')} &nbsp;
          </span>
          <i className="fas fa-arrow-right"></i>
        </Button>
      </Col>
    </Row>
  )
}

export default IncomeHistoryForm
export { IncomeHistoryForm }
