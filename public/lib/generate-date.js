const moment = require('moment')
moment.locale('it')

const numberOfItems = 5

const normalizeDate = (date) => moment(date).hours(10).minute(0).second(0)

const findDay = (searchedDay, daylist) =>
  daylist.find((currentDay) =>
    moment(currentDay.date).isSame(moment(searchedDay.date))
  )

const findAllDaysInBoundaries = (startDay, endDay, daylist) =>
  daylist.filter(
    (curr) =>
      moment(curr.date).isSameOrAfter(moment(startDay)) &&
      moment(curr.date).isSameOrBefore(moment(endDay))
  )

const getWeekBoundaries = (currentDate) => {
  var startOfWeek = moment(currentDate).clone().startOf('week').weekday(1)
  var endOfWeek = moment(currentDate).clone().endOf('week').weekday(7)

  return {
    start: startOfWeek.toDate(),
    end: endOfWeek.clone().subtract(1, 'd').toDate()
  }
}

const getMonthBoundaries = (currentDate) => {
  var startOfMonth = moment(currentDate).clone().startOf('month')
  var endOfMonth = moment(currentDate).clone().endOf('month')

  return {
    start: startOfMonth.clone().add(1, 'd').toDate(),
    end: endOfMonth.toDate()
  }
}

const nextN = (currentDate, type, mult = 1) =>
  [...Array(numberOfItems).keys()].map((elem) =>
    moment(currentDate)
      .clone()
      .add((elem + 1) * mult, type)
      .toDate()
  )

const beforeN = (currentDate, type, mult = 1) =>
  [...Array(numberOfItems).keys()]
    .map((elem) =>
      moment(currentDate)
        .clone()
        .subtract((elem + 1) * mult, type)
        .toDate()
    )
    .reverse()

const getTotalIncomeOfDay = (currentDate, dayList) => {
  let date = normalizeDate(currentDate)

  return [
    ...beforeN(date, 'days').map((elem) => ({ date: elem, current: false })),
    ...[moment(date).toDate()].map((elem) => ({ date: elem, current: true })),
    ...nextN(date, 'days').map((elem) => ({ date: elem, current: false }))
  ].map((elem) =>
    findDay(elem, dayList)
      ? {
          ...findDay(elem, dayList),
          current: elem.current,
          label: moment(elem.date).format('DD-MM-YY')
        }
      : {
          date: elem.date,
          total: 0,
          current: elem.current,
          label: moment(elem.date).format('DD-MM-YY')
        }
  )
}

const getTotalIncomeOfWeek = (currentDate, dayList) => {
  let date = normalizeDate(currentDate)
  return [
    ...beforeN(date, 'days', 7).map(getWeekBoundaries),
    { ...getWeekBoundaries(date.toDate()), current: true },
    ...nextN(date, 'days', 7).map(getWeekBoundaries)
  ].map((elem) =>
    findAllDaysInBoundaries(elem.start, elem.end, dayList).reduce(
      (acc, curr) => ({
        ...acc,
        total: acc.total + curr.total
      }),
      {
        total: 0,
        start: elem.start,
        end: elem.end,
        current: elem.current,
        label: `${moment(elem.start).format('DD-MM-YY')} - ${moment(
          elem.end
        ).format('DD-MM-YY')}`
      }
    )
  )
}

const getTotalIncomeOfMonth = (currentDate, dayList) => {
  let date = normalizeDate(currentDate)
  return [
    ...beforeN(date, 'months').map(getMonthBoundaries),
    { ...getMonthBoundaries(moment(date).toDate()), current: true },
    ...nextN(date, 'months').map(getMonthBoundaries)
  ].map((elem) =>
    findAllDaysInBoundaries(elem.start, elem.end, dayList).reduce(
      (acc, curr) => ({
        ...acc,
        total: acc.total + curr.total
      }),
      {
        total: 0,
        start: elem.start,
        end: elem.end,
        current: elem.current,
        month: moment(elem.start).format('MMMM'),
        label: moment(elem.start).format('MMMM')
      }
    )
  )
}

const getTotalIncome = (currentDate, type, orderList) => {
  let dayList = orderList
    .map(({ date, total }) => ({
      date: normalizeDate(date),
      total
    }))
    .sort((a, b) => moment(a.date).diff(moment(b.date)))

  let operations = {
    day: getTotalIncomeOfDay(currentDate, dayList),
    week: getTotalIncomeOfWeek(currentDate, dayList),
    month: getTotalIncomeOfMonth(currentDate, dayList)
  }

  return operations[type]
}

module.exports = {
  getTotalIncome
}
