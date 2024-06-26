import { StyleSheet, View, SafeAreaView, StatusBar, Appearance, ActivityIndicator } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview'
import { APP_ID, PERMISION_CODE, REDIRECT_URI } from '@env'
import { useDispatch, useSelector } from 'react-redux'
import * as SecureStore from 'expo-secure-store'
import { 
  setAccessToken, 
  setExpiresIn, 
  setLogin, 
  setUserId, 
  setUserDrawerImageUrl,
  setFirstName,
  setLastName,
  initUserData 
} from '../redux/userSlice'
import { COLORS } from '../constants/theme'
import { getTimeDate } from '../utils/date'
const WebViewLogin = () => {
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const dispatch = useDispatch();
  const [shouldShowLoadingScreen, setShouldShowLoadingScreen] = React.useState(false)
  const onNavChange = (navigationState) => {
    const regex = /^https:\/\/oauth\.vk\.com\/blank\.html.*$/g
    const url = navigationState.url
    // console.log(url)
    if (regex.test(url)) {
      setShouldShowLoadingScreen(true);
      const accessTokenRegex = /access_token=[a-zA-Z0-9-._]*/g;
      const expiresInRegex = /expires_in=\d*/g;
      const expireInRegex = /expire_in=\d*/g;
      const userIdRegex = /user_id=.*/g;
      const accessToken = url.match(accessTokenRegex)[0].split('access_token=')[1];
      let expiresIn
      expiresIn = url.match(expiresInRegex)[0].split('expires_in=')[1];
      if (expiresIn === undefined) {
        expiresIn = url.match(expireInRegex)[0].split('expires_in=')[1];
      }
      const userId = url.match(userIdRegex)[0].split('user_id=')[1];
      const date = Date.now() + expiresIn * 1000
      console.log(url, '\n', accessToken, '\n', userId)

      const imageRequestUrl = `https://api.vk.com/method/users.get?access_token=${accessToken}&user_ids=${userId}&fields=photo_100&v=5.131`
      const getUserImage = async (imageRequestUrl) => {
        const res = await fetch(imageRequestUrl)
        const data = await res.json()
        await SecureStore.setItemAsync('accessToken', accessToken)
        await SecureStore.setItemAsync('expiresIn', `${date}`)
        await SecureStore.setItemAsync('userId', `${userId}`)
        await SecureStore.setItemAsync('userProfileDrawerPhotoUrl', data.response[0].photo_100)
        await SecureStore.setItemAsync('firstName', data.response[0].first_name)
        await SecureStore.setItemAsync('lastName', data.response[0].last_name)
        dispatch(initUserData({
          accessToken,
          expiresIn: date,
          userId,
          userProfileDrawerPhotoUrl: data.response[0].photo_100,
          firstName: data.response[0].first_name,
          lastName: data.response[0].last_name
        }));
      }
      getUserImage(imageRequestUrl);
    }
  }
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={isLightTheme ? COLORS.primary : COLORS.primary_dark} barStyle={COLORS.white}/>
      {
        shouldShowLoadingScreen ?
        <View 
          style={[
            {width: '100%', height: '100%', justifyContent: 'center'}, 
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}
          ]}
        >
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View>:
        <WebView 
          source={{
            uri: `https://oauth.vk.com/authorize?client_id=${51613222}&display=mobile&redirect_uri=${REDIRECT_URI}&scope=${402582}&response_type=token&v=5.131&revoke=1`
          }}
          onNavigationStateChange={onNavChange}
          startInLoadingState={true}
          renderLoading={() => {
          return (
            <View 
              style={[
                {width: '100%', height: '100%', justifyContent: 'center'}, 
                isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}
              ]}
            >
              <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
            </View>
          )
        }}
        scalesPageToFit={true}
      />        
      }
    </SafeAreaView>
  )
}

export default WebViewLogin

const styles = StyleSheet.create({})