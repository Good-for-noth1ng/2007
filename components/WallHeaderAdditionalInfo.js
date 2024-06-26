import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid';
import Animated, { useSharedValue, useDerivedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated'
import PersonalListItem from './PersonalListItem'
import { COLORS } from '../constants/theme'
import PersonalContactItem from './PersonalContactItem'

const WallHeaderAdditionalInfo = ({description, navigation, cleanedLinks, cleanedUsers, expanded, lang}) => {
  // const height = useSharedValue(0)

  // const derivedHeight = useDerivedValue(() => withTiming(height.value * Number(expanded), {duration: 500}))
  // const bodyStyle = useAnimatedStyle(() => ({
  //   height: derivedHeight.value
  // }))
  if (!expanded) {
    return null
  }
  
  return (
    <View style={[styles.container]}>
      {/* <View onLayout={(e) => {
        console.log(e.nativeEvent.layout.height)
        height.value = e.nativeEvent.layout.height
      }}
        style={{
          width: '100%',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
        }}
      > */}
      {
        description ?
        <PersonalListItem title={lang == 'ru' ? 'описание' : 'description'} info={description}/> : null 
      }
      {
        cleanedLinks ?
        <Text style={{color: COLORS.secondary, fontSize: 16, textTransform: 'uppercase', margin: 10}}>
          {lang == 'ru' ? `Ссылки ${cleanedLinks.length}` : `Links ${cleanedLinks.length}`}
        </Text> : null
      }
      {
        cleanedLinks ? 
        cleanedLinks.map(link => 
          <PersonalContactItem 
            name={link.name}
            photo={link.photo_100}
            descritption={link.desc}
            navigation={navigation}
            ownerId={link.name ? -1 * link.id : link.id}
            key={link.key}
          />
        ) : null
      }
      {
        cleanedUsers ?
        <Text style={{color: COLORS.secondary, fontSize: 16, textTransform: 'uppercase', margin: 10}}>
          {lang == 'ru' ? `Контакты ${cleanedUsers.length}` : `Contacts ${cleanedUsers.length}`}
        </Text> : null
      }
      
      {
        cleanedUsers ? 
        cleanedUsers.map(user => 
          <PersonalContactItem 
            name={`${user.first_name} ${user.last_name}`}
            photo={user.photo_100}
            descritption={user.desc}
            navigation={navigation}
            ownerId={user.first_name ? user.id : -1 * user.id}
            key={user.key}
          />
        ) : null
      }
      {/* </View> */}
    </View>
  )
}

export default WallHeaderAdditionalInfo

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background_dark,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  }
})