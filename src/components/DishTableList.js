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
import { useTranslation } from 'react-i18next'

function DishTableList({ dishList, updateDish, removeDish }) {
  const { t } = useTranslation(['dish-table-list'])

  const actions = (dish) => (
    <>
      <Button
        className="mr-2 mb-2"
        variant="primary"
        type="button"
        size="sm"
        onClick={() => updateDish(dish)}>
        <i className="fas fa-pencil-alt"></i> {t('button.modify')}
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="danger"
        type="button"
        size="sm"
        onClick={() => removeDish(dish)}>
        <i className="fas fa-trash"></i> {t('button.remove')}
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
      { Header: t('columns.name'), accessor: 'name' },
      { Header: t('columns.description'), accessor: 'description' },
      { Header: t('columns.price'), accessor: 'price' },
      { Header: t('columns.action'), accessor: 'actions' }
    ],
    [t]
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
