import { StyleSheet, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'

const LoadingSpinner = () => {
  return (
    <View>
      <ActivityIndicator color={COLORS.primary} size={50}/>
    </View>
  )
}

export default LoadingSpinner

const styles = StyleSheet.create({
    spinnerContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})