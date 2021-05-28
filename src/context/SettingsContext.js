import React from 'react'

const initSettings = {
  name: '',
  address: '',
  cap: '00146',
  city: '',
  phone: '',
  network: {
    address: '',
    port: 9100
  }
}

const value = {
  settings: initSettings,
  getSettings: () => {}
}

const SettingsContext = React.createContext(value)

export { SettingsContext, initSettings }

export default SettingsContext
