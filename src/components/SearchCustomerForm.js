import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { Form } from 'react-bootstrap'
import React, { useState } from 'react'

function SearchCustomerForm({ forwardedRef, onChangeCustomer }) {
  const [isLoading, setIsLoading] = useState(false)
  const [customerOptionList, setCustomerOptionList] = useState([])

  return (
    <Form.Group controlId="customer">
      <Form.Label>
        {' '}
        <b>Ricerca Cliente</b> :
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
        placeholder="Cerca il cliente ..."
        options={customerOptionList}
      />
    </Form.Group>
  )
}

export { SearchCustomerForm }

export default SearchCustomerForm
