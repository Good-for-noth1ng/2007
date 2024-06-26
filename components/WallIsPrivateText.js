import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import DividerWithLine from './DividerWithLine'
import { COLORS } from '../constants/theme'

const WallIsPrivateText = ({isPrivateText}) => {
  return (
    <>
      <DividerWithLine dividerHeight={10}/>
      <View style={styles.mainContainer}>
        <FontAwesome name='lock' color={COLORS.secondary} size={18}/>
        <Text style={styles.text}> {isPrivateText}</Text>
      </View>
    </>
    
  )
}

export default WallIsPrivateText

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    color: COLORS.secondary
  }
})