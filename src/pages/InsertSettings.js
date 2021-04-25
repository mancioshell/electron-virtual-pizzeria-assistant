import React, { useState, useEffect, useContext } from 'react'
import UIContext from '../context/UIContext'

import SettingsForm from '../components/SettingsForm'

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

function InsertSettings() {
  const [settings, setSettings] = useState(initSettings)

  const { addSuccessMessage } = useContext(UIContext)

  useEffect(() => {
    const getCurrentSettings = async () => {
      let currentSettings = await window?.api?.getSettings()
      setSettings(currentSettings)
    }

    getCurrentSettings()
  }, [])

  const saveSettings = async (savedSettings, resetForm) => {
    await window?.api?.insertSettings(savedSettings)
    resetForm(savedSettings)
    addSuccessMessage({
      text: 'Impostazioni salvate con successo',
      type: 'Impostazioni',
      show: true
    })
  }

  return (
    <div id="container">
      <header className="mt-4">
        <h1>
          {' '}
          <i className="fas fa-pencil-alt"></i> Modifica Impostazioni{' '}
        </h1>
      </header>

      <section className="mt-5" id="formsSettingsContainer">
        <h3>
          {' '}
          <i className="fas fa-cogs"></i> Impostazioni{' '}
        </h3>

        <hr className="mt-2"></hr>

        <SettingsForm
          settings={settings}
          saveSettings={saveSettings}></SettingsForm>
      </section>
    </div>
  )
}

export { InsertSettings }

export default InsertSettings
