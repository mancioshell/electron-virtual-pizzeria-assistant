import { Toast } from 'react-bootstrap'
import React, { useContext } from 'react'

import { UIContext } from '../context/UIContext'

function Messages() {
  const { addSuccessMessage, successMessage } = useContext(UIContext)

  return successMessage.show ? (
    <Toast
      animation={true}
      onClose={() => addSuccessMessage({ text: '', type: '', show: false })}
      show={successMessage.show}
      delay={5000}
      autohide>
      <Toast.Header>
        <h4 className="mr-auto">
          <i className="fas fa-pizza-slice"></i>&nbsp;&nbsp;
          {successMessage.type}
        </h4>
      </Toast.Header>
      <Toast.Body>
        {' '}
        <strong>{successMessage.text} </strong>
      </Toast.Body>
    </Toast>
  ) : null
}

export { Messages }

export default Messages
