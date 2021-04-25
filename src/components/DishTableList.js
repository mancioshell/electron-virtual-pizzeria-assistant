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

function DishTableList({ dishList, updateDish, removeDish }) {
  const actions = (dish) => (
    <>
      <Button
        className="mr-2 mb-2"
        variant="primary"
        type="button"
        size="sm"
        onClick={() => updateDish(dish)}>
        <i className="fas fa-pencil-alt"></i> Modifica
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="danger"
        type="button"
        size="sm"
        onClick={() => removeDish(dish)}>
        <i className="fas fa-trash"></i> Rimuovi
      </Button>
    </>
  )

  const data = React.useMemo(
    () =>
      dishList.map((dish) => ({
        ...dish,
        price: `\u20AC ${dish.price}`,
        actions: actions(dish)
      })),
    [dishList]
  )

  const columns = React.useMemo(
    () => [
      { Header: 'Nome', accessor: 'name' },
      { Header: 'Descrizione', accessor: 'description' },
      { Header: 'Prezzo', accessor: 'price' },
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
        searchLabel="Ricerca Portata"
        selectLabel="Portate per pagina"
        {...tableFormProps}></TableForm>
      <TablePagination
        {...tableProps}
        paginationProps={paginationProps}></TablePagination>
    </>
  )
}

export { DishTableList }

export default DishTableList
