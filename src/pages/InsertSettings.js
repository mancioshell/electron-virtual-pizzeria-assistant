import React, { useContext } from 'react'
import UIContext from '../context/UIContext'

import SettingsForm from '../components/SettingsForm'
import { SettingsContext } from '../context/SettingsContext'

function InsertSettings() {
  const { settings, setSettings } = useContext(SettingsContext)
  const { addSuccessMessage } = useContext(UIContext)

  const saveSettings = async (savedSettings, resetForm) => {
    await window?.api?.insertSettings(savedSettings)
    setSettings(savedSettings)
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
