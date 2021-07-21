import { useState, useEffect, useRef } from 'react'
import { Row, Col } from 'react-bootstrap'

import Diagram from '../components/Diagram'
import IncomeHistoryForm from '../components/IncomeHistoryForm'
import { useTranslation } from 'react-i18next'

function IncomeHistory() {
  const [incomeType, setIncomeType] = useState('day')
  const [date, setDate] = useState(new Date())
  const [income, setIncome] = useState(0)

  const { t } = useTranslation(['income-history'])

  const label = {
    day: t('label.day'),
    week: t('label.week'),
    month: t('label.month')
  }

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

    getData().catch(console.error)
  }, [incomeType, date])

  return (
    <div className="mt-4">
      <h1>
        {' '}
        <i className="fas fa-euro-sign"></i> {t('title')}
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

export { IncomeHistory }

export default IncomeHistory
