const plugin = {
  type: 'languageDetector',
  async: true,
  init: function (services, detectorOptions, i18nextOptions) {
    /* use services and options */
  },
  detect: function (callback) {
    window?.api?.getAppLocale().then(callback)  
  },
  cacheUserLanguage: function (lng) {
    /* cache language */
  }
}

export default plugin
