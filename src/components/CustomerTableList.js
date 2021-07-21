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

function CustomerTableList({ customerList, updateCustomer, createOrder }) {
  const { t } = useTranslation(['customer-table-list'])

  const actions = (customer) => (
    <>
      <Button
        className="mr-2 mb-2"
        variant="primary"
        type="button"
        size="sm"
        onClick={() => updateCustomer(customer)}>
        <i className="fas fa-pencil-alt"></i> {t('button.create')}
      </Button>
      <Button
        className="mr-2 mb-2"
        variant="success"
        type="button"
        size="sm"
        onClick={() => createOrder(customer)}>
        <i className="fas fa-copy"></i> {t('button.modify')}
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
      { Header: t('columns.name'), accessor: 'name' },
      { Header: t('columns.surname'), accessor: 'surname' },
      { Header: t('columns.address'), accessor: 'address' },
      { Header: t('columns.phone'), accessor: 'phone' },
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
        searchLabel={t('label.search-customer')}
        selectLabel={t('label.customer-per-page')}
        {...tableFormProps}></TableForm>
      <TablePagination
        {...tableProps}
        paginationProps={paginationProps}></TablePagination>
    </>
  )
}

export { CustomerTableList }

export default CustomerTableList
