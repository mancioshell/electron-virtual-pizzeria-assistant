const { app } = require('electron')

const escpos = require('escpos')
escpos.Network = require('escpos-network')
escpos.USB = require('escpos-usb')

const i18n = require('../i18n')
let i18next = i18n.initI18Next(app.getLocale())

function formatDate(date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return year + '/' + month + '/' + day
}

async function testConnection(settings) {
  console.log('Connecting to ', settings.network.address, settings.network.port)

  let device = new escpos.Network(
    settings.network.address,
    settings.network.port
  )

  return new Promise((resolve, reject) => {
    device.open(function (error) {
      if (error) return reject(error)

      return resolve('Connection OK')
    })
  })
}

async function findUSBPrinter() {
  const data = escpos.USB.findPrinter().map((device) => ({
    label: `${device.deviceDescriptor.idVendor}-${device.deviceDescriptor.idProduct}`,
    value: `${device.deviceDescriptor.idVendor};${device.deviceDescriptor.idProduct}`
  }))
  return data
}

async function generateReceipt(order, settings) {

  const options = { encoding: 'utf-8', width: 32 }

  let device, printer

  if (settings.choice === 'network') {
    console.log(
      'Connecting to ',
      settings.network.address,
      settings.network.port
    )

    device = new escpos.Network(settings.network.address, settings.network.port)
  } else {
    const vid = settings.usb.split(';')[0]
    const pid = settings.usb.split(';')[1]
    console.log('Connecting to ', vid, pid)

    device = new escpos.USB(vid, pid)
  }

  printer = new escpos.Printer(device, options)

  return new Promise((resolve, reject) => {
    device.open(function (error) {
      if (error) return reject(error)

      const company = {
        name: settings.name,
        address: settings.address,
        city: `${settings.cap} ${settings.city}`,
        phone: settings.phone
      }

      const data = order.items

      printer.newLine().align('ct').style('B').size(1.6, 1)

      printer.text(company.name).newLine()

      printer.size(1)

      printer
        .text(company.address)
        .text(company.city)
        .text(company.phone)
        .newLine()

      printer.style('NORMAL')
      printer.align('lt')

      printer
        .text(`${i18next.t('receipt.customer')}: `)
        .drawLine()
        .text(`${i18next.t('receipt.name')}: ${order.customer.name}`)
        .text(`${i18next.t('receipt.surname')}: ${order.customer.surname}`)
        .text(`${i18next.t('receipt.address')}: ${order.customer.address}`)
        .text(`${i18next.t('receipt.phone')}: ${order.customer.phone}`)
        .drawLine()
        .newLine()

      printer
        .text(`${i18next.t('receipt.order')}: `)
        .drawLine()
        .text(`${i18next.t('receipt.order-number')}: ${order._id}`)

      if (order.booking) {
        printer
          .text(
            `${i18next.t('receipt.booking-date')}: ${formatDate(order.date)}`
          )
          .text(`${i18next.t('receipt.bookling-hour')}: ${order.time}`)
      }

      printer.text(`${i18next.t('receipt.note')}: ${order.notes}`).newLine()

      printer.tableCustom([
        { text: `${i18next.t('receipt.dish')}`, width: '0.5', align: 'LEFT' },
        {
          text: `${i18next.t('receipt.price')} (${i18next.t('receipt.euro')})`,
          width: '0.5',
          align: 'RIGHT'
        }
      ])

      printer.drawLine()

      data.forEach((item) => {
        printer.tableCustom([
          {
            text: `${item.dish.name} ${item.amount} x ${item.dish.price}`,
            width: '0.8',
            align: 'LEFT'
          },
          { text: item.dish.price * item.amount, width: '0.2', align: 'RIGHT' }
        ])
      })

      printer.drawLine()

      printer.style('B').tableCustom([
        { text: `${order.total} ${i18next.t('receipt.total')}`, align: 'LEFT' },
        { text: `${order.total} ${i18next.t('receipt.euro')}`, align: 'RIGHT' }
      ])

      printer
        .newLine()
        .newLine()
        .text(`${i18next.t('receipt.disclaimer')}`)

      printer.newLine().newLine().newLine().newLine().newLine().close()

      return resolve('Receipt printed')
    })
  })
}

module.exports = {
  generateReceipt,
  testConnection,
  findUSBPrinter
}
