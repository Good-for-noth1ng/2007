import React from 'react';
import * as SplashScreen from 'expo-splash-screen'
import * as SecureStore from 'expo-secure-store'
import * as Localization from 'expo-localization'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Login from '../screens/Login';
import Home from './Home';
import WebViewLogin from '../screens/WebViewLogin';
import { initUserData, updateLang } from '../redux/userSlice';

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();
const AppContainer = () => {
    const dispatch = useDispatch()
    const [isReady, setIsReady] = React.useState(false)
    const isLoggedIn = useSelector(state => state.user.isLoggedIn)
    React.useEffect(() => {
      const getToken = async () => {
        // console.log(Localization.getLocales())
        const lang = Localization.getLocales()[0].languageCode 
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const expiresIn = await SecureStore.getItemAsync('expiresIn');
        const userId = await SecureStore.getItemAsync('userId');
        const userProfileDrawerPhotoUrl = await SecureStore.getItemAsync('userProfileDrawerPhotoUrl')
        const firstName = await SecureStore.getItemAsync('firstName')
        const lastName = await SecureStore.getItemAsync('lastName')
        console.log(accessToken, expiresIn)
        const curDate = Date.now()
        //if there is the token and it expires in more than 6 hours
        if (accessToken && expiresIn - curDate > 21600000) {
          dispatch(initUserData({
            accessToken,
            expiresIn,
            userId,
            userProfileDrawerPhotoUrl,
            firstName,
            lastName,
            lang
          }))
          setIsReady(true)
        } else {
          dispatch(updateLang(lang))
          setIsReady(true)
        }   
      }
      getToken()
    }, [isLoggedIn])

    const onLayout = React.useCallback(async () => {
      if (isReady) {
        await SplashScreen.hideAsync()
      }
    }, [isReady])

    if (!isReady) {
      return null;
    }

    return (
      <NavigationContainer onReady={onLayout}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {
            isLoggedIn ? 
            <Stack.Screen name='Home' component={ Home }/> : 
            <>
              <Stack.Screen name='Login' component={ Login }/>
              <Stack.Screen name='WebViewLogin' component={ WebViewLogin } />
            </>                        
          }
        </Stack.Navigator>
      </NavigationContainer>
    )
}

export default AppContainer