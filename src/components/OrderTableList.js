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

function OrderTableList({
  orderList,
  updateOrder,
  removeOrder,
  readOrder,
  printReceipt
}) {
  const { t } = useTranslation(['order-table-list'])

  const actions = (order) => (
    <>
      <Button
        className="mr-2 mb-2"
        variant="dark"
        type="button"
        size="sm"
        onClick={(e) => readOrder(e, order)}>
        <i className="fas fa-clipboard-list"></i> {t('actions.view')}
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="primary"
        type="button"
        size="sm"
        onClick={(e) => updateOrder(e, order)}>
        <i className="fas fa-pencil-alt"></i> {t('actions.modify')}
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="info"
        type="button"
        size="sm"
        onClick={(e) => printReceipt(order)}>
        <i className="fas fa-print"></i> {t('actions.print')}
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="danger"
        type="button"
        size="sm"
        onClick={(e) => removeOrder(e, order)}>
        <i className="fas fa-trash"></i> {t('actions.remove')}
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
      { Header: t('columns.name'), accessor: 'name' },
      { Header: t('columns.surname'), accessor: 'surname' },
      { Header: t('columns.address'), accessor: 'address' },
      { Header: t('columns.booking-date'), accessor: 'date' },
      { Header: t('columns.booking-date'), accessor: 'time' },
      { Header: t('columns.actions'), accessor: 'actions' }
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
        searchLabel={t('label.order-search')}
        selectLabel={t('label.order-per-page')}
        {...tableFormProps}></TableForm>
      <TablePagination
        {...tableProps}
        paginationProps={paginationProps}></TablePagination>
    </>
  )
}

export { OrderTableList }

export default OrderTableList
