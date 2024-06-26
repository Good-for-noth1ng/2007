import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../constants/theme'
const TextInputField = ({isLightTheme, lang}) => {
  const inputField = useRef('')
  const [colorOfSendButton, setColorOfSendButton] = useState(false)
  const handleChanges = (text) => {
    if (text !== '') {
      setColorOfSendButton(true)
    } else if (text === '') {
      setColorOfSendButton(false)
    }
  }
  return (
    <View style={isLightTheme ? styles.inputContainerLight : styles.inputContainerDark}>
      <Feather name='paperclip' color={COLORS.secondary} size={25}/>
      <TextInput 
        ref={inputField}
        style={isLightTheme ? styles.inputLight : styles.inputDark}
        placeholder={lang == 'ru' ? 'Комментировать' : 'Comment'}
        placeholderTextColor={COLORS.smoke}
        selectionColor={COLORS.secondary}
        onChangeText={handleChanges}
        multiline={true}
      />
      <Ionicons name='send' color={colorOfSendButton ? COLORS.primary : COLORS.secondary} size={25}/>
    </View>
  )
}

export default TextInputField

const styles = StyleSheet.create({
  inputContainerLight: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  inputContainerDark: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary_dark,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  inputLight: {
    width: '75%',
    height: 40,
    fontSize: 17,
    color: COLORS.black
  },
  inputDark: {
    width: '75%',
    height: 40,
    fontSize: 17,
    color: COLORS.primary_text
  }
})