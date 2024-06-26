import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { getShortagedNumber } from '../utils/numShortage'
import { COLORS } from '../constants/theme'

const SearchResultHeaderCounter = ({ counterNum, isLightTheme, counterName, handleShowMorePress, lang }) => {
  const onShowMore = () => {
    handleShowMorePress()
  }
  return (
    <View style={[styles.container, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.textName, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{counterName}   </Text>
        <Text style={styles.textNum}>{getShortagedNumber(counterNum)}</Text>
      </View>
      {
        handleShowMorePress ?
        <TouchableOpacity onPress={onShowMore}>
          <Text style={styles.showMore}>{lang == 'ru' ? 'Показать ещё' : 'Show more'}</Text>
        </TouchableOpacity> : null
      }
    </View>
  )
}

export default SearchResultHeaderCounter

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  textName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  textNum: {
    color: COLORS.secondary,
    fontSize: 14
  },
  showMore: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  }
})