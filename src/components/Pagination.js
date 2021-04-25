import { Pagination } from 'react-bootstrap'

function TablePagination({
  previousPage,
  canPreviousPage,
  nextPage,
  canNextPage,
  gotoPage,
  pageCount,
  pageOptions,
  pageIndex
}) {
  return (
    <Pagination>
      <Pagination.First onClick={() => gotoPage(0)} />
      {canPreviousPage && <Pagination.Prev onClick={() => previousPage()} />}

      {pageOptions.map((page, i) => {
        return (
          <Pagination.Item
            key={i}
            active={pageIndex === page}
            onClick={() => gotoPage(page)}>
            {page + 1}
          </Pagination.Item>
        )
      })}

      {canNextPage && <Pagination.Next onClick={() => nextPage()} />}

      <Pagination.Last onClick={() => gotoPage(pageCount - 1)} />
    </Pagination>
  )
}

export { TablePagination }

export default TablePagination
