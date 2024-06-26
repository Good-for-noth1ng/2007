import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const BottomPostButton = ({icon, count}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} activeOpacity={1}>
      {icon}
      <Text style={styles.buttonText}>{count}</Text>
    </TouchableOpacity>
  )
}

export default BottomPostButton

const styles = StyleSheet.create({
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 30,
    },
    iconButton: {
        marginRight: 3
    },
    buttonText: {
        marginLeft: 3,
        color: COLORS.secondary
    },
})