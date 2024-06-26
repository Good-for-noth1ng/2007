import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import Entypo from 'react-native-vector-icons/Entypo'
import CustomHeader from '../components/CustomHeader'
import { COLORS } from '../constants/theme'

const Messages = ({navigation}) => {
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const openDrawer = () => {
    navigation.openDrawer()
  }
  return (
    <SafeAreaView>  
      <CustomHeader 
        isLightTheme={isLightTheme}
        headerName={
          <Text style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}}>Messages</Text>
        }
        iconComponent={
          <Entypo name='menu' color={COLORS.white} size={30}/>
        }
        iconTouchHandler={openDrawer}
        navigation={navigation}
        isScreenFromDrawerMenu={true}
      />
    </SafeAreaView>
  )
}

export default Messages

const styles = StyleSheet.create({
  
})