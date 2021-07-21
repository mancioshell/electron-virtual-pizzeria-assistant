import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { I18nextProvider } from 'react-i18next'
import { render } from '@testing-library/react'

const i18nConfig = (resource) => {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      debug: false,
      saveMissing: false,
      fallbackNS: 'translation',
      lng: 'it', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
      interpolation: {
        escapeValue: false // react already safes from xss
      },
      react: {
        useSuspense: false //
      },
      resources: {
        it: {
          translation: resource
        }
      }
    })

  return i18n
}

const i18NextCustomRender = (ui, config = {}, { ...renderOptions } = {}) => {
  const Component = (props) => (
    <I18nextProvider i18n={i18nConfig(config)}>
      {props.children}
    </I18nextProvider>
  )
  return render(<Component>{ui}</Component>, renderOptions)
}

export default i18NextCustomRender
