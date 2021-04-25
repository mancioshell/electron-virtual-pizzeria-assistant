import { Row, Col, Form } from 'react-bootstrap'

function TableForm({
  searchLabel,
  selectLabel,
  globalFilter,
  pageSize,
  setPageSize,
  setGlobalFilter
}) {
  return (
    <Row className="mt-5">
      <Col md="6">
        <Form.Group controlId="item">
          <Form.Label>
            <b>{searchLabel}</b> :
          </Form.Label>
          <Form.Control
            type="text"
            name="filter-surname"
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            required
            placeholder="Ricerca ..."
          />
        </Form.Group>
      </Col>

      <Col md="3">
        <Form.Group controlId="page-size">
          <Form.Label>
            <b>{selectLabel}</b> :
          </Form.Label>
          <Form.Control
            as="select"
            custom
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrane {pageSize}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Col>
    </Row>
  )
}

export { TableForm }

export default TableForm
