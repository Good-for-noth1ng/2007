import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Options from '../screens/Options'
import Account from '../screens/Account'
import Security from '../screens/Security'
import Privacy from '../screens/Privacy'
import Notifications from '../screens/Notifications'
import Blacklist from '../screens/Blacklist'

const OptionsStack = createNativeStackNavigator();

const OptionsRoute = () => {
  return (
    <OptionsStack.Navigator>
      <OptionsStack.Screen name='OptionsMain' component={Options} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <OptionsStack.Screen name='Account' component={Account} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <OptionsStack.Screen name='Security' component={Security} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <OptionsStack.Screen name='Privacy' component={Privacy} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <OptionsStack.Screen name='Notifications' component={Notifications} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <OptionsStack.Screen name='Blacklist' component={Blacklist} options={{headerShown: false, animation: 'slide_from_right'}}/>  
    </OptionsStack.Navigator>
  )
}

export default OptionsRoute
