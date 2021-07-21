import React, { useContext } from 'react'
import UIContext from '../context/UIContext'

import SettingsForm from '../components/SettingsForm'
import { SettingsContext } from '../context/SettingsContext'
import { useTranslation } from 'react-i18next'

function InsertSettings() {
  const { settings, setSettings } = useContext(SettingsContext)
  const { addSuccessMessage } = useContext(UIContext)

  const { t } = useTranslation(['insert-settings'])

  const saveSettings = async (savedSettings, resetForm) => {
    await window?.api?.insertSettings(savedSettings)
    setSettings(savedSettings)
    resetForm(savedSettings)
    addSuccessMessage({
      text: t('success-save-message'),
      type: t('success-save-message-title'),
      show: true
    })
  }

  return (
    <div id="container">
      <header className="mt-4">
        <h1>
          {' '}
          <i className="fas fa-pencil-alt"></i> {t('modify-title')}
        </h1>
      </header>

      <section className="mt-5" id="formsSettingsContainer">
        <h3>
          {' '}
          <i className="fas fa-cogs"></i> {t('title')}
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
