import { Row, Col, Form, Button } from 'react-bootstrap'

function IncomeHistoryForm({ incomeType, setIncomeType, date, setDate }) {
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
          <span className="d-none d-sm-inline-block">&nbsp; Precedente</span>
        </Button>
      </Col>
      <Col md={{ span: 4 }} xs={{ span: 8 }}>
        <Form.Group controlId="page-size">
          <Form.Label>
            <b>Incasso per</b> :
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
              { label: 'Giorno', value: 'day' },
              { label: 'Settimana', value: 'week' },
              { label: 'Mese', value: 'month' }
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
          <span className="d-none d-sm-inline-block">Successivo &nbsp;</span>
          <i className="fas fa-arrow-right"></i>
        </Button>
      </Col>
    </Row>
  )
}

export default IncomeHistoryForm
export { IncomeHistoryForm }
