const { contextBridge } = require('electron')
const Datastore = require('nedb-promises')
let orders = Datastore.create('./db/orders.db')
let customers = Datastore.create('./db/customers.db')
let dishItems = Datastore.create('./db/dish-items.db')
let settings = Datastore.create('./db/settings.db')

const initSettings = {
  id: 'settings',
  name: 'Nome Pizzeria',
  address: 'Indirizzo Pizzeria',
  city: 'Città Pizzeria',
  cap: 'Cap Pizzeria',
  phone: 'Telefono Pizzeria',
  network: { address: '255.255.255.1', port: 9100 }
}

const { generateReceipt, testConnection } = require('./generate-receipt.js')

contextBridge.exposeInMainWorld('api', {
  insertSettings: async (newSettings) => {
    return settings.update({ id: 'settings' }, { ...newSettings })
  },
  getSettings: async () => {
    let currentSettings = await settings.findOne({ id: 'settings' })
    if (!currentSettings) currentSettings = settings.insert({ ...initSettings })

    return currentSettings
  },
  getOrderList: async () => {
    let orderList = await orders.find()

    let joinedList = []

    for (let order of orderList) {
      let customer = await customers.findOne({ _id: order.customer })

      let items = []

      for (let item of order.items) {
        let currentItem = await dishItems.findOne({ _id: item.dish })
        items.concat([currentItem])
      }

      joinedList = joinedList.concat([{ ...order, customer, items }])
    }

    return joinedList
  },
  getOrderById: async (id) => {
    let order = await orders.findOne({ _id: id })
    let customer = await customers.findOne({ _id: order.customer })
    return { ...order, customer }
  },
  removeOrder: async (order) => {
    return orders.remove({ _id: order._id })
  },
  getCustomerById: async (id) => {
    return customers.findOne({ _id: id })
  },
  getCustomerList: async () => {
    return customers.find()
  },
  getCustomerListSuggestions: async (query) => {
    return customers.find({
      $or: [
        { name: new RegExp(query, 'gi') },
        { surname: new RegExp(query, 'gi') },
        { phone: new RegExp(query, 'gi') },
        { address: new RegExp(query, 'gi') }
      ]
    })
  },
  insertCustomer: async (customer) => {
    return customer._id
      ? customers.update({ _id: customer._id }, { ...customer })
      : customers.insert({ ...customer })
  },
  insertOrder: async (order) => {
    let customer = order.customer
    let newCustomer = customer._id ? customer : await customers.insert(customer)

    if (customer._id) await customers.update({ _id: customer._id }, customer)

    let time = order.booking ? order.time : '00:00'
    let date = order.booking ? order.date : new Date()

    if (order._id) {
      await orders.update(
        { _id: order._id },
        {
          ...order,
          time,
          date,
          customer: newCustomer._id,
          updatedAt: new Date()
        }
      )
      return { ...order, customer: newCustomer }
    } else {
      let result = await orders.insert({
        ...order,
        time,
        date,
        customer: newCustomer._id,
        createdAt: new Date()
      })
      return { ...order, customer: newCustomer, _id: result._id }
    }
  },
  getDishById: async (id) => {
    let dish = await dishItems.findOne({ _id: id, legacy: false })
    return dish
  },
  insertDish: async (dish) => {
    if (dish._id) {
      await dishItems.update(
        { _id: dish._id },
        { ...dish, updatedAt: new Date() }
      )
      return dish
    } else {
      let result = await dishItems.insert({
        ...dish,
        legacy: false,
        createdAt: new Date()
      })
      return { ...dish, _id: result._id }
    }
  },
  removeDish: async (dish) => {
    await dishItems.update(
      { _id: dish._id },
      { ...dish, legacy: true, updatedAt: new Date() }
    )
  },
  getDishList: async () => {
    return dishItems.find({ legacy: false })
  },
  testConnection: async (order) => {
    let currentSettings = await settings.findOne({ id: 'settings' })
    await testConnection(currentSettings)
  },
  printReceipt: async (order) => {
    let currentSettings = await settings.findOne({ id: 'settings' })

    let currentOrder = await orders.findOne({ _id: order._id })
    let customer = await customers.findOne({ _id: currentOrder.customer })

    let dishList = []
    let total = 0

    for (let item of currentOrder.items) {
      let currentItem = await dishItems.findOne({ _id: item.dish })
      dishList = dishList.concat([
        {
          dish: currentItem,
          amount: item.amount,
          subTotal: item.amount * currentItem.price
        }
      ])
      total += item.amount * currentItem.price
    }

    currentOrder = { ...currentOrder, items: dishList, customer, total }

    await generateReceipt(currentOrder, currentSettings)
  }
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
