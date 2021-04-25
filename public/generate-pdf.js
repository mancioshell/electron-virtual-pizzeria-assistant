const path = require('path')
const PDFDocument = require('pdfkit')

const rootDir = path.dirname(__dirname)
const logo = path.join(rootDir, 'public', 'pizza-logo.png')

const company = {
  name: 'La Pinseria JG',
  address: 'Via Lari 19  00146',
  city: 'Roma',
  phone: '06 45508525'
}

function generatePdfByOrder(order) {
  let doc = new PDFDocument({ size: 'A4', margin: 50 })

  generateHeader(doc, company)
  generateCustomerInformation(doc, order)

  generateOrderNotes(doc, order)

  let items = []

  let i,
    j,
    chunkArray,
    chunk = 10
  for (i = 0, j = order.items.length; i < j; i += chunk) {
    chunkArray = order.items.slice(i, i + chunk)
    items = [...items, chunkArray]
  }

  for (let chunk of items) {
    generateInvoiceTable(doc, chunk, order.total)
    doc.addPage()
    generateFooter(doc)
  }

  return doc
}

function generateHeader(doc, { name, address, city, phone }) {
  doc
    .image(logo, 50, 45, { width: 100 })
    .fillColor('#444444')
    .fontSize(20)
    .text(name, 150, 57)
    .fontSize(10)
    .text(name, 200, 50, { align: 'right' })
    .text(address, 200, 65, { align: 'right' })
    .text(phone, 200, 80, { align: 'right' })
    .text(city, 200, 95, { align: 'right' })
    .moveDown()
}

function generateCustomerInformation(doc, order) {
  doc.fillColor('#444444').fontSize(20).text('Cliente', 50, 160)

  generateHr(doc, 185)

  const customerInformationTop = 200

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Numero Ordine:', 50, customerInformationTop)
    .font('Helvetica')
    .text(order._id, 170, customerInformationTop)
    .font('Helvetica-Bold')

  doc
    .text('Data Prenotazione:', 50, customerInformationTop + 15)
    .font('Helvetica')
    .text(
      order.booking ? formatDate(order.date) : '-',
      170,
      customerInformationTop + 15
    )
    .font('Helvetica-Bold')
    .text('Orario Prenotazione:', 50, customerInformationTop + 30)
    .font('Helvetica')
    .text(order.booking ? order.time : '-', 170, customerInformationTop + 30)

  doc
    .font('Helvetica-Bold')
    .text('Nome:', 280, customerInformationTop)
    .font('Helvetica')
    .text(`${order.customer.name}`, 390, customerInformationTop)
    .font('Helvetica-Bold')
    .text('Cognome:', 280, customerInformationTop + 15)
    .font('Helvetica')
    .text(`${order.customer.surname}`, 390, customerInformationTop + 15)
    .font('Helvetica-Bold')
    .text('Indirizzo:', 280, customerInformationTop + 30)
    .font('Helvetica')
    .text(order.customer.address, 390, customerInformationTop + 30)
    .font('Helvetica-Bold')
    .text('Recapito Telefonico:', 280, customerInformationTop + 45)
    .font('Helvetica')
    .text(order.customer.phone, 390, customerInformationTop + 45)
    .moveDown()

  generateHr(doc, 267)
}

function generateOrderNotes(doc, order) {
  doc.fillColor('#444444').fontSize(10).text('Note:', 50, 350)
  doc.fillColor('#444444').fontSize(10).text(order.notes, 50, 370)
}

function generateInvoiceTable(doc, items, total) {
  let i
  const invoiceTableTop = 430

  doc.fillColor('#444444').fontSize(20).text('Ordine', 50, 300)
  generateHr(doc, 325)

  doc.font('Helvetica-Bold')
  generateTableRow(
    doc,
    invoiceTableTop,
    'Portata',
    'Prezzo',
    'Quantità',
    'Totale'
  )
  generateHr(doc, invoiceTableTop + 20, 50, 450)
  doc.font('Helvetica')

  for (i = 0; i < items.length; i++) {
    const item = items[i]
    const position = invoiceTableTop + (i + 1) * 30
    generateTableRow(
      doc,
      position,
      item.dish.name,
      formatCurrency(item.dish.price),
      item.amount,
      formatCurrency(item.subTotal)
    )

    generateHr(doc, position + 20, 50, 450)
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Importo da Pagare',
    formatCurrency(total)
  )
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      `Quest'ordine è stato generato il ${new Date().toLocaleDateString()} alle ore ${new Date().toLocaleTimeString()}`,
      50,
      780,
      { align: 'center', width: 500 }
    )
}

function generateTableRow(doc, y, name, amount, price, subTotal) {
  doc
    .fontSize(10)
    .text(name, 50, y)
    .text(amount, 200, y)
    .text(price, 280, y)
    .text(subTotal, 380, y)
  // .text(quantity, 370, y, { width: 90, align: "right" })
  //.text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y, start = 50, end = 550) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(start, y)
    .lineTo(end, y)
    .stroke()
}

function formatCurrency(currency) {
  return `\u20AC ${currency.toFixed(2)}`
}

function formatDate(date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return year + '/' + month + '/' + day
}

module.exports = {
  generatePdfByOrder
}

//const fileName = `order-${order._id}.pdf`

// let buffers = []

// pdf.on('data', buffers.push.bind(buffers));
// pdf.on('end', () => {

//     let data = Buffer.concat(buffers);

//     const element = document.createElement("a");
//     const file = new Blob([data], { type: "application/pdf" });
//     element.href = URL.createObjectURL(file);
//     element.download = fileName;
//     element.click();

// });

// pdf.end();
