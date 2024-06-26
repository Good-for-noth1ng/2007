import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'

const OpenedPostHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text>OpenedPostHeader</Text>
    </View>
  )
}

export default OpenedPostHeader

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        backgroundColor: COLORS.primary
    }
})