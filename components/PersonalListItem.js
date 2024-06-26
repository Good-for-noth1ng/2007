import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'


const PersonalListItem = ({ title, info, isLightTheme }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.info, isLightTheme ? {color: COLORS.primary_text} : {color: COLORS.primary_text}]}>
        {info}
      </Text>
    </View>
  )
}

export default PersonalListItem

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  info: {
    fontSize: 17,
  },
  title: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: COLORS.secondary
  }
})