import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-electron-fs-backend'
import LanguageDetector from './react-electron-language-detector'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',      
      ipcRenderer: window.api.i18nextElectronBackend // important!
    },
    debug: true,
    saveMissing: false,   
    //lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option    
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false //
    }
  })

export default i18n
