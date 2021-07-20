import React from 'react'
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination
} from 'react-table'

import TableForm from './TableForm'
import TablePagination from './TablePagination'
import { useTranslation } from 'react-i18next'

function DishList({ items }) {
  const { t } = useTranslation(['order-dish-list'])

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
      { Header: t('columns.dish'), accessor: 'name' },
      { Header: t('columns.price'), accessor: 'price' },
      { Header: t('columns.amount'), accessor: 'amount' },
      { Header: t('columns.total'), accessor: 'total' }
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
        searchLabel={t('label.search-dish')}
        selectLabel={t('dish-list-per-page')}
        {...tableFormProps}></TableForm>
      <TablePagination
        {...tableProps}
        paginationProps={paginationProps}></TablePagination>
    </>
  )
}

export { DishList }

export default DishList
