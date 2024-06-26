import { StyleSheet, Text, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import { COLORS } from '../constants/theme'

const Security = ({navigation}) => {
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const goBack = () => {
    navigation.pop()
  }
  return (
    <SafeAreaView style={isLightTheme ? styles.mainContainerLight : styles.manContainerDark}>
      <StatusBar backgroundColor={isLightTheme ? COLORS.primary : COLORS.primary_dark}/>
      <CustomHeader
        isLightTheme={isLightTheme}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        headerName={<Text style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}}>Security</Text>}
        iconTouchHandler={goBack}
      />
    </SafeAreaView>
  )
}

export default Security

const styles = StyleSheet.create({
  mainContainerLight: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  manContainerDark: {
    flex: 1,
    backgroundColor: COLORS.background_dark
  }
})