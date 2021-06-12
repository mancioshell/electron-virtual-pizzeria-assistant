const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  insertSettings: async (newSettings) =>
    ipcRenderer.invoke('insertSettings', newSettings),
  getSettings: async () => ipcRenderer.invoke('getSettings'),
  getOrderList: async () => ipcRenderer.invoke('getOrderList'),
  getOrderById: async (id) => ipcRenderer.invoke('getOrderById', id),
  removeOrder: async (order) => ipcRenderer.invoke('removeOrder', order),
  getCustomerById: async (id) => ipcRenderer.invoke('getCustomerById', id),
  getCustomerList: async () => ipcRenderer.invoke('getCustomerList'),
  getCustomerListSuggestions: async (query) =>
    ipcRenderer.invoke('getCustomerListSuggestions', query),
  insertCustomer: async (customer) =>
    ipcRenderer.invoke('insertCustomer', customer),
  insertOrder: async (order) => ipcRenderer.invoke('insertOrder', order),
  getDishById: async (id) => ipcRenderer.invoke('getDishById', id),
  insertDish: async (dish) => ipcRenderer.invoke('insertDish', dish),
  removeDish: async (dish) => ipcRenderer.invoke('removeDish', dish),
  getDishList: async (dish) => ipcRenderer.invoke('getDishList', dish),
  testConnection: async () => ipcRenderer.invoke('testConnection'),
  printReceipt: async (order) => ipcRenderer.invoke('printReceipt', order),
  getAppVersion: async () => ipcRenderer.invoke('getAppVersion'),
  getTotalIncomeByType: async (date, type) =>
    ipcRenderer.invoke('getTotalIncomeByType', date, type)
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
