const escpos = require('escpos')
escpos.Network = require('escpos-network')

function formatDate(date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return year + '/' + month + '/' + day
}

async function testConnection(settings) {
  console.log('Connecting to ', settings.network.address, settings.network.port)

  let device = new escpos.Network(settings.network.address, settings.network.port)

  return new Promise((resolve, reject) => {
    device.open(function (error) {
      if (error) return reject(error)

      return resolve('Connection OK')
    })
  })
}

async function generateReceipt(order, settings) {
  const options = { encoding: 'utf-8', width: 32 }

  let device, printer

  console.log('Connecting to ', settings.network.address, settings.network.port)

  device = new escpos.Network(settings.network.address, settings.network.port)
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
        .text('Cliente: ')
        .drawLine()
        .text(`Nome: ${order.customer.name}`)
        .text(`Cognome: ${order.customer.surname}`)
        .text(`Indirizzo: ${order.customer.address}`)
        .text(`Telefono: ${order.customer.phone}`)
        .drawLine()
        .newLine()

      printer.text('Ordine: ').drawLine().text(`Numero Ordine: ${order._id}`)

      if (order.booking) {
        printer
          .text(`Data Prenotazione: ${formatDate(order.date)}`)
          .text(`Orario Prenotazione: ${order.time}`)
      }

      printer.text(`Note: ${order.notes}`).newLine()

      printer.tableCustom([
        { text: 'Portata', width: '0.5', align: 'LEFT' },
        { text: 'Prezzo (Euro)', width: '0.5', align: 'RIGHT' }
      ])

      printer.drawLine()

      data.map((item) => {
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
        { text: 'Totale', align: 'LEFT' },
        { text: `${order.total} Euro`, align: 'RIGHT' }
      ])

      printer
        .newLine()
        .newLine()
        .text(`Questo scontrino non ha validita' fiscale`)

      printer.newLine().close()

      return resolve('Receipt printed')
    })
  })
}

module.exports = {
  generateReceipt,
  testConnection
}
