import React from 'react'
import { View, Text, SafeAreaView, StatusBar, StyleSheet, useColorScheme, ScrollView } from 'react-native'
// import { authorize } from 'react-native-app-auth'
// import * as Linking from 'expo-linking'
// import * as WebBrowser from 'expo-web-browser'
// import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../components/Header'
import { LoginButton } from '../components/Buttons'
import { SIZES, COLORS } from '../constants/theme'
import { toggleCurrentColorScheme } from '../redux/colorSchemeSlice'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'

const Login = ({navigation}) => {
  const dispatch = useDispatch() 
  const colorScheme = useColorScheme()
  const lang = useSelector(state => state.user.lang)
  console.log(lang)
  if (colorScheme === 'dark') {
    dispatch(toggleCurrentColorScheme())
  }

  const isLightTheme = colorScheme === 'light'

  return (
    // <View>
    <SafeAreaView style={[styles.mainContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.background_dark}]}>
      <Header screenName={lang == 'ru' ? 'Авторизация' : 'Authorization'} isLight={isLightTheme}/>
      {/* <ScrollView style={{flex: 1}}> */}
        <View style={styles.heroButtonContainer}>
          <View style={styles.textContainer}>
            <Text style={[styles.textHeader, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
              {
                lang == 'ru' ?
                'Добро пожаловать!' :
                'Welcome!'
              }
            </Text>
            <Text style={[styles.subtitle, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
              {
                lang == 'ru' ? 
                'oldvk - мобильное приложение для соцсети вконтакте' :
                'oldvk is mobile app for vk'
              }
            </Text>
          </View>
          <LoginButton buttonText={lang == 'ru' ? 'Войти через vk.com' : 'Sign in'} isLightTheme={isLightTheme}  navigation={navigation}/>
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  heroButtonContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 100,
    justifyContent: 'center'
  },
  textContainer: {
    width: '65%',
    gap: 20,
    justifyContent: 'space-between',
  },
  textHeader: {
    fontSize: SIZES.extraLarge,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    color: COLORS.black,  
  },
});

export default Login