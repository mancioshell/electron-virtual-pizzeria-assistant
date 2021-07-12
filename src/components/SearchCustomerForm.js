import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { Form } from 'react-bootstrap'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

function SearchCustomerForm({ forwardedRef, onChangeCustomer }) {
  const [isLoading, setIsLoading] = useState(false)
  const [customerOptionList, setCustomerOptionList] = useState([])

  const { t } = useTranslation(['search-customer-form'])

  return (
    <Form.Group controlId="customer">
      <Form.Label>
        <b>{t('label')}</b> :
      </Form.Label>

      <AsyncTypeahead
        ref={forwardedRef}
        id="searchCustomer"
        clearButton={true}
        isLoading={isLoading}
        labelKey={(option) =>
          `${option.name} ${option.surname} ${option.phone} ${option.address}`
        }
        onChange={(optionList) => {
          let customer = optionList.length > 0 ? optionList[0] : {}
          onChangeCustomer(customer)
        }}
        onSearch={async (query) => {
          setIsLoading(true)
          let customerList = await window?.api?.getCustomerListSuggestions(
            query
          )
          setCustomerOptionList(customerList)
          setIsLoading(false)
        }}
        placeholder={t('placeholder')}
        options={customerOptionList}
      />
    </Form.Group>
  )
}

export { SearchCustomerForm }

export default SearchCustomerForm
