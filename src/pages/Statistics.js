import { useState, useEffect, useRef } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'

import Diagram from '../components/Diagram'

const label = {
  day: 'Incasso del Giorno',
  week: 'Incasso della Settimana',
  month: 'Incasso del Mese'
}

const steps = (type, date) => {
  const steps = {
    day: 1,
    week: 7,
    month: new Date(date.getYear(), date.getMonth() + 1, 0).getDate()
  }
  return steps[type]
}

function Statistics() {
  const [incomeType, setIncomeType] = useState('day')
  const [date, setDate] = useState(new Date())
  const [income, setIncome] = useState(0)

  const ref = useRef()

  useEffect(() => {
    const getData = async () => {
      const dateWithoutTime = date.toISOString().split('T')[0]
      const data = await window?.api?.getTotalIncomeByType(
        dateWithoutTime,
        incomeType
      )

      let max = data.reduce((acc, next) =>
        acc.total >= next.total ? acc : next
      ).total

      Diagram(ref.current, data, Math.max(max, 100))

      let currentItem = data.find((elem) => elem.current)
      setIncome(currentItem.total)
    }

    getData()
  }, [incomeType, date])

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
    <div className="mt-4">
      <h1>
        {' '}
        <i className="fas fa-euro-sign"></i> Storico Incassi
      </h1>

      <Row className="mt-5">
        <Col md={{ span: 12 }}>
          <svg ref={ref} />
        </Col>
      </Row>

      <Row className="mb-3 mt-5">
        <Col md={{ span: 12 }}>
          <p>
            <strong>{label[incomeType]}: </strong> &#8364; {income}{' '}
            {date.toISOString()}
          </p>
        </Col>
      </Row>

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
    </div>
  )
}

export { Statistics }

export default Statistics
