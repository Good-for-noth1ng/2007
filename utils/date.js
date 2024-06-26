const getShortMonth = (date, lang) => {
    const monthNumber = date.getMonth();
    switch(monthNumber) {
        case 0:
            return lang == 'ru' ? 'Янв' : 'Jan'
        case 1:
            return lang == 'ru' ? 'Фев' : 'Feb'
        case 2:
            return lang == 'ru' ? 'Мар' :'Mar'
        case 3:
            return lang == 'ru' ? 'Апр' : 'Apr'
        case 4:
            return lang == 'ru' ? 'Май' : 'May'
        case 5:
            return lang == 'ru' ? 'Июнь' : 'June'
        case 6:
            return lang == 'ru' ? 'Июль' : 'July'
        case 7:
            return lang == 'ru' ? 'Авг' : 'Aug'
        case 8:
            return lang == 'ru' ? 'Сен' : 'Sep'
        case 9:
            return lang == 'ru' ? 'Окт' : 'Oct'
        case 10:
            return lang == 'ru' ? 'Нояб' : 'Nov'
        case 11:
            return lang == 'ru' ? 'Дек' : 'Dec' 
    }
}

const getMonthByNumber = (num) => {
  switch(num) {
    case 1:
      return 'January'
    case 2:
      return 'February'
    case 3:
      return 'March'
    case 4:
      return 'April'
    case 5:
      return 'May'
    case 6:
      return 'June'
    case 7:
      return 'Jule'
    case 8:
      return 'August'
    case 9:
      return 'September'
    case 10:
      return 'October'
    case 11:
      return 'November'
    case 12:
      return 'December' 
    }
}

const getFullMonth = (date, lang) => {
    const monthNumber = date.getMonth();
    switch(monthNumber) {
        case 0:
            return lang == 'ru' ? 'Января' : 'January'
        case 1:
            return lang == 'ru' ? 'Февраля' : 'February'
        case 2:
            return lang == 'ru' ? 'Марта' : 'March'
        case 3:
            return lang == 'ru' ? 'Апреля' : 'April'
        case 4:
            return lang == 'ru' ? 'Мая' : 'May'
        case 5:
            return lang == 'ru' ? 'Июня' : 'June'
        case 6:
            return lang == 'ru' ? 'Июля' : 'July'
        case 7:
            return lang == 'ru' ? 'Августа' : 'August'
        case 8:
            return lang == 'ru' ? 'Сентября' : 'September'
        case 9:
            return lang == 'ru' ? 'Октября' : 'October'
        case 10:
            return lang == 'ru' ? 'Ноября' : 'November'
        case 11:
            return lang == 'ru' ? 'Декабря' : 'December' 
    }
}

const getMinutes = (date) => {
    const minutes = date.getMinutes();
    if (minutes < 10) {
        return '0' + minutes;
    } else {
        return minutes
    }
}
//TODO: make 'posted 3 hours ago' etc.
export const getTimeDate = (unixTime, lang) => {
    const date = new Date(unixTime * 1000);
    const todayDate = new Date();
    if (date.getFullYear() === todayDate.getFullYear() && date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()) {
        return `${lang == 'ru' ? 'сегодня в' :'today at'} ${date.getHours()}:${getMinutes(date)}`
    } else if (date.getFullYear() === todayDate.getFullYear()) {
        if (date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate() - 1) {
            return `${lang == 'ru' ? 'вчера в' : 'yesterday at'} ${date.getHours()}:${getMinutes(date)}`
        } else {
            return `${date.getDate()} ${getFullMonth(date, lang)} ${lang == 'ru' ? 'в' : 'at'} ${date.getHours()}:${getMinutes(date)}`
        }
    } else {
        return `${date.getDate()} ${getShortMonth(date, lang)} ${date.getFullYear()} ${lang == 'ru' ? 'в' : 'at'} ${date.getHours()}:${getMinutes(date)}`
    }
}

const stringifyAge = (age, lang) => {
  if (lang == 'ru') {
    const t = age % 10
    console.log(t, age, age > 14 && t < 5 && t > 0 )
    if (age > 14 && t < 5 && t > 1 ) {
      return `${age} года`
    } else if (age > 14 && t == 1) {
      return `${age} год`
    } else {
      return `${age} лет`
    }
  }
  if (age === 1) {
    return `${age} year old`
  } else {
    return `${age} years old`
  }
}

export const getUserAge = (str, lang) => {
  const pattern = /\d*\.\d*\.\d*/
  if (pattern.test(str)) {
  const year = Number(str.split('.')[2])
  const month = Number(str.split('.')[1])
  const day = Number(str.split('.')[0])
  const date = new Date()
  const currentYear = date.getFullYear()
  const currentMonth = date.getMonth() + 1
  const currentDay = date.getDate()

  if (currentMonth > month) {
    return stringifyAge(currentYear - year, lang)
  } else if (month === currentMonth) {
    if (currentDay >= day) {
      return stringifyAge(currentYear - year, lang)
    } else {
      return stringifyAge(currentYear - year - 1, lang)
    }
  } else {
    return stringifyAge(currentYear - year - 1, lang)
  }
  } else {
    return null
  }
}

//Number return undefined
export const getUserBdate = (str) => {
//   console.log(Number(str.split('.')[1]) - 1)
  const pattern = /d*\.d*/g
  if (pattern.test(str)) {
    const month = getMonthByNumber(Number(str.split('.')[1]))
    return `${str.split('.')[0]} ${month}`
  } else {
    const month = getMonthByNumber(Number(str.split('.')[1]))
    return `${str.split('.')[0]} ${month} ${str.split('.')[2]}`
  }
}