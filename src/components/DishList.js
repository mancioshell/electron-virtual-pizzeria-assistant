import React from 'react'
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination
} from 'react-table'

import TableForm from './TableForm'
import TablePagination from './TablePagination'

function DishList({ items }) {
  const data = React.useMemo(
    () =>
      items.map((item) => ({
        ...item,
        price: `\u20AC ${item.price}`,
        total: `\u20AC ${item.amount * item.price}`
      })),
    [items]
  )

  const columns = React.useMemo(
    () => [
      { Header: 'Portata', accessor: 'name' },
      { Header: 'Prezzo', accessor: 'price' },
      { Header: 'Quantità', accessor: 'amount' },
      { Header: 'Totale', accessor: 'total' }
    ],
    []
  )

  const tableInstance = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    previousPage,
    canPreviousPage,
    nextPage,
    canNextPage,
    page,
    gotoPage,
    pageCount,
    pageOptions,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter }
  } = tableInstance

  const paginationProps = {
    previousPage,
    canPreviousPage,
    nextPage,
    canNextPage,
    gotoPage,
    setPageSize,
    pageCount,
    pageOptions,
    pageIndex
  }
  const tableFormProps = {
    globalFilter,
    pageSize,
    setPageSize,
    setGlobalFilter
  }
  const tableProps = {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow
  }

  return (
    <>
      <TableForm
        searchLabel="Ricerca Portata"
        selectLabel="Portate per pagina"
        {...tableFormProps}></TableForm>
      <TablePagination
        {...tableProps}
        paginationProps={paginationProps}></TablePagination>
    </>
  )
}

export { DishList }

export default DishList
