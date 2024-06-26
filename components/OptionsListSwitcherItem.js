import { StyleSheet, Text, View, Switch } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { COLORS } from '../constants/theme'

const OptionsListSwitcherItem = ({ iconName, name, value, isLightTheme, setNewValue }) => {
  const toggleSwitcher = () => {
    setNewValue()
  }
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.iconsTextContainer}>  
        <View style={styles.iconContainer}>
          <FontAwesome name={iconName} color={COLORS.white} size={22}/>
        </View>
        <Text style={isLightTheme ? styles.nameLight : styles.nameDark}>
          {name}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={toggleSwitcher}
        trackColor={{false: COLORS.secondary, true: COLORS.smoke}}
        thumbColor={COLORS.light_smoke}
      />
    </View>
  )
}

export default OptionsListSwitcherItem

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5
  },
  iconsTextContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 100, 
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameLight: {
    fontSize: 16,
    marginLeft: 10
  },
  nameDark: {
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.primary_text
  }
})