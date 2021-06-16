import { useState, useEffect, useRef } from 'react'
import { Row, Col } from 'react-bootstrap'

import Diagram from '../components/Diagram'
import IncomeHistoryForm from '../components/IncomeHistoryForm'

const label = {
  day: 'Incasso del Giorno',
  week: 'Incasso della Settimana',
  month: 'Incasso del Mese'
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
            <strong>{label[incomeType]}: </strong> &#8364; {income}
          </p>
        </Col>
      </Row>

      <IncomeHistoryForm
        incomeType={incomeType}
        setIncomeType={setIncomeType}
        date={date}
        setDate={setDate}></IncomeHistoryForm>
    </div>
  )
}

export { Statistics }

export default Statistics
