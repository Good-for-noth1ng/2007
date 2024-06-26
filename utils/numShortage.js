export const getShortagedNumber = (num) => {
    if (num < 1000) {
        return `${num}`
    } else if (num < 1000000) {
      const mainPart = (num - num % 1000) / 1000
      const addPart = Math.round(num % 1000 / 100)
      if (addPart > 0) {
        return `${mainPart}.${addPart}k`
      } else {
        return `${mainPart}k`
      }
    } else if (num < 1000000000) {
      const mainPart = (num - num % 1000000) / 1000000
      const addPart = Math.round(num % 1000000 / 100000)
      if (addPart > 0) {
        return `${mainPart}.${addPart}kk`
      } else {
        return `${mainPart}kk`
      }
    }
    // if (num < 1000) {
    //   return `${num}`
    // } else if (num < 1000000) {
    //   return `${Math.round(num / 1000)}k`
    // } else if (num < 1000000000) {
    //   return `${Math.round(num / 1000000)}k`
    // }
}

export const getSongCurStatus = (durMil, positionMil) => {
  const seconds = Math.round(positionMil / 1000)
  // console.log(seconds)
  let min = Math.floor(seconds / 60)
  let sec = seconds - min * 60
  if (min < 10) {
    min = `0${min}`
  } else {
    min = `${min}`
  }
  if (sec < 10) {
    sec = `0${sec}`
  } else {
    sec = `${sec}`
  }
  return min + ':' + sec
}

export const getDuration = (num) => {
  const seconds = num % 60
  num = (num - (num % 60)) / 60
  const minutes = num % 60
  num = (num - (num % 60)) / 60
  const hours = num % 60
  let result
  if (seconds < 10) {
    result = `0${seconds}`
  } else {
    result = `${seconds}`
  }
  if (minutes === 0) {
    result = '00:' + result 
  } else if (minutes < 10) {
    result = `0${minutes}:` + result
  } else if (minutes > 9) {
    result = `${minutes}:` + result
  }
  if (hours === 0) { 
    return result
  } else if (hours < 10) {
    return `0${hours}:` + result
  } else if (hours > 9) {
    return `${hours}:` + result
  }
}
