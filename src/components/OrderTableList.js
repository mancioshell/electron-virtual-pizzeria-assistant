import { Button } from 'react-bootstrap'
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination
} from 'react-table'
import React from 'react'

import TableForm from './TableForm'
import TablePagination from './TablePagination'

function OrderTableList({
  orderList,
  updateOrder,
  removeOrder,
  readOrder,
  printReceipt
}) {
  const actions = (order) => (
    <>
      <Button
        className="mr-2 mb-2"
        variant="dark"
        type="button"
        size="sm"
        onClick={(e) => readOrder(e, order)}>
        <i className="fas fa-clipboard-list"></i> Visualizza
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="primary"
        type="button"
        size="sm"
        onClick={(e) => updateOrder(e, order)}>
        <i className="fas fa-pencil-alt"></i> Modifica
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="info"
        type="button"
        size="sm"
        onClick={(e) => printReceipt(order)}>
        <i className="fas fa-print"></i> Stampa
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="danger"
        type="button"
        size="sm"
        onClick={(e) => removeOrder(e, order)}>
        <i className="fas fa-trash"></i> Rimuovi
      </Button>
    </>
  )

  const data = React.useMemo(
    () =>
      orderList.map(({ customer, booking, date, time, _id }) => {
        const { name, surname, address } = customer
        return {
          name,
          surname,
          address,
          date: booking ? date.toLocaleDateString() : '-',
          time: booking ? time : '-',
          actions: actions({ customer, booking, date, time, _id })
        }
      }),
    [orderList]
  )

  const columns = React.useMemo(
    () => [
      { Header: 'Nome', accessor: 'name' },
      { Header: 'Cognome', accessor: 'surname' },
      { Header: 'Indirizzo', accessor: 'address' },
      { Header: 'Data Prenotazione', accessor: 'date' },
      { Header: 'Ora Prenotazione', accessor: 'time' },
      { Header: 'Azioni', accessor: 'actions' }
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
        searchLabel="Ricerca Ordine"
        selectLabel="Ordini per pagina"
        {...tableFormProps}></TableForm>
      <TablePagination
        {...tableProps}
        paginationProps={paginationProps}></TablePagination>
    </>
  )
}

export { OrderTableList }

export default OrderTableList
