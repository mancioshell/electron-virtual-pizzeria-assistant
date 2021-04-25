import { Table, Row, Col } from 'react-bootstrap'

import Pagination from './Pagination'

function TablePagination({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  page,
  prepareRow,
  paginationProps
}) {
  return (
    <Row className="mt-3">
      <Col>
        <Table
          {...getTableProps()}
          className="mt-4"
          responsive="md"
          striped
          hover>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  if (column.id === 'actions') column.disableSortBy = true

                  return (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      &nbsp;&nbsp;
                      {column.id !== 'actions' ? (
                        column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="fas fa-sort-down"></i>
                          ) : (
                            <i className="fas fa-sort-up"></i>
                          )
                        ) : (
                          <i className="fas fa-sort"></i>
                        )
                      ) : (
                        ''
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.column.id === 'address' ? (
                          <span
                            className="d-inline-block text-truncate"
                            style={{ maxWidth: '400px' }}>
                            {cell.render('Cell')}
                          </span>
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
        <Pagination {...paginationProps}></Pagination>
      </Col>
    </Row>
  )
}

export { TablePagination }

export default TablePagination
