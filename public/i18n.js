const i18next = require('i18next')
const Backend = require('i18next-fs-backend')

function initI18Next(lang) {
  i18next.use(Backend).init({
    initImmediate: false,
    debug: true,
    ns: 'backend',
    defaultNS: 'backend',
    fallbackNS: 'backend',
    lng: lang,
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json'
    }
  })

  return i18next
}

module.exports = {
  initI18Next
}
