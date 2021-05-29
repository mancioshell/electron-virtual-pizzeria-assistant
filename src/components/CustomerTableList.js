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

function CustomerTableList({ customerList, updateCustomer, createOrder }) {
  const actions = (customer) => (
    <>
      <Button
        className="mr-2 mb-2"
        variant="primary"
        type="button"
        size="sm"
        onClick={() => updateCustomer(customer)}>
        <i className="fas fa-pencil-alt"></i> Modifica
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="success"
        type="button"
        size="sm"
        onClick={() => createOrder(customer)}>
        <i className="fas fa-copy"></i> Crea Ordine
      </Button>
    </>
  )

  const data = React.useMemo(
    () =>
      customerList.map((customer) => ({
        ...customer,
        actions: actions(customer)
      })),
    [customerList]
  )

  const columns = React.useMemo(
    () => [
      { Header: 'Nome', accessor: 'name' },
      { Header: 'Cognome', accessor: 'surname' },
      { Header: 'Indirizzo', accessor: 'address' },
      { Header: 'Recapito Telefonico', accessor: 'phone' },
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
        searchLabel="Ricerca Cliente"
        selectLabel="Clienti per pagina"
        {...tableFormProps}></TableForm>
      <TablePagination
        {...tableProps}
        paginationProps={paginationProps}></TablePagination>
    </>
  )
}

export { CustomerTableList }

export default CustomerTableList
