import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../constants/theme'

const OptionsListInputItem = ({value, title, handler, isLightTheme}) => {
  const [inputFieldValue, setInputFieldValue] = useState(value)
  return (
    <View>
      <Text style={isLightTheme ? styles.titleLight : styles.titleDark}>{title}</Text>
      <TextInput 
        style={isLightTheme ? styles.inputFieldLight : styles.inputFieldDark}
        selectionColor={COLORS.secondary}
        value={inputFieldValue}
        onChangeText={setInputFieldValue}
      />
    </View>
  )
}

export default OptionsListInputItem

const styles = StyleSheet.create({
  titleLight: {
    fontSize: 17,
    color: COLORS.secondary
  },
  titleDark : {
    fontSize: 17,
    color: COLORS.secondary
  },
  inputFieldLight: {
    width: '100%',
    height: 45,
    fontSize: 17,
    backgroundColor: COLORS.very_light_gray,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.light_smoke,
    paddingLeft: 10,
    color: COLORS.black
  },
  inputFieldDark: {
    width: '100%',
    height: 50,
    fontSize: 17,
    backgroundColor: COLORS.very_light_gray,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.very_light_gray,
    paddingLeft: 10,
    color: COLORS.primary_text
  },
})
