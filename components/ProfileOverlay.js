import { StyleSheet, Text, View, Animated, TouchableOpacity, Image, ActivityIndicator, ToastAndroid, Dimensions } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Clipboard from 'expo-clipboard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import { closeRegInfo } from '../redux/regDateSlice'
import { COLORS } from '../constants/theme'
import { getTimeDate } from '../utils/date'

const width = Dimensions.get('window').width

const ProfileOverlay = ({ isLightTheme, navigation, lang }) => {
  const dispatch = useDispatch()
  const commentsGeneralData = useSelector(state => state.userRegDate);
  const shouldPerformAnim = React.useRef(false);
  const slideAnimation = React.useRef(new Animated.Value(2000)).current;
  const isGlobalShadowExpanded = useSelector(state => state.globalShadow.isOpen);
  // console.log(commentsGeneralData)
  const name = commentsGeneralData.name;
  const imgUrl = commentsGeneralData.imgUrl;
  const registrationDate = commentsGeneralData.registrationDate;
  const registrationDateIsFetching = commentsGeneralData.isFetching;
  const userId = commentsGeneralData.userId;
  const isRegDateInfoOpen = commentsGeneralData.isOpen;

  React.useEffect(() => {
    if (!isGlobalShadowExpanded) {
      dispatch(closeRegInfo())
    }
  }, [isGlobalShadowExpanded])

  React.useEffect(() => {
    if (shouldPerformAnim.current) {
      if (isRegDateInfoOpen) {
        Animated.timing(slideAnimation, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true
        }).start()
      } else {
        Animated.timing(slideAnimation, {
          toValue: 2000,
          duration: 500,
          useNativeDriver: true
        }).start()
      }
    } else {
      shouldPerformAnim.current = true
    }
  }, [isRegDateInfoOpen])


  return (
    <Animated.View style={[styles.box, {transform: [{translateY: slideAnimation}, {translateX: (width - 320) / 2 }]}]}>
      <View style={[styles.menu, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.very_dark_gray}]}> 
        <View style={styles.nameAvatarContainer}>
          <Image style={styles.avatarInfo} source={imgUrl === 'banned' ? require('../assets/avatars/banned-light.jpg') : {uri: imgUrl}}/>
          <Text style={[styles.nameInfo, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>{name}</Text>
        </View>
        <View style={styles.registredContainer}>
                {
                  registrationDateIsFetching ?
                  <View>
                    <ActivityIndicator size={30} color={isLightTheme ? COLORS.primary : COLORS.white}/>
                  </View>:
                    registrationDate !== 0 ? 
                      <Text style={styles.registredText}>{lang == 'ru' ? 'Профиль создан' : 'Registred'}: {getTimeDate(registrationDate)}</Text> :
                      null
                }
        </View>
        <View style={[{flexDirection: 'row', justifyContent: 'center',}]}>
          <View style={[{flexDirection: 'row', gap: 40, padding: 10}, lang == 'ru' &&  {flexDirection: 'column'}]}>
            <TouchableOpacity activeOpacity={0.8} style={styles.commentMenuButton}>
              <MaterialCommunityIcons name='content-copy' color={isLightTheme ? COLORS.primary : COLORS.white} size={25}/>
              <Text style={[styles.commentMenuButtonText, isLightTheme ? {color: COLORS.primary} : {color: COLORS.white}]}>
                {lang == 'ru' ? 'Копировать' : 'Copy'}
              </Text>
            </TouchableOpacity>
              
            <TouchableOpacity style={styles.commentMenuButton}>
              <Ionicons name='arrow-redo-outline' color={isLightTheme ? COLORS.primary : COLORS.white} size={25}/>
              <Text style={[styles.commentMenuButtonText, isLightTheme ? {color: COLORS.primary} : {color: COLORS.white}]}>
                {lang == 'ru' ? 'Поделиться' : 'Share'}
              </Text>
            </TouchableOpacity>
              
            <TouchableOpacity style={styles.commentMenuButton}>
              <Octicons name='report' color={isLightTheme ? COLORS.primary : COLORS.white} size={25}/>
              <Text style={[styles.commentMenuButtonText, isLightTheme ? {color: COLORS.primary} : {color: COLORS.white}]}>
                {lang == 'ru' ? 'Пожаловаться' : 'Report'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

export default ProfileOverlay

const styles = StyleSheet.create({
  box: {
    width: 320,
    height: '55%',
    zIndex: 6,
    position: 'absolute',
  },
  menu: {
    width: '100%',
    height: '100%',
    elevation: 30,
    shadowColor: COLORS.black,
    borderRadius: 5,
    paddingTop: 35,
    paddingRight: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  nameAvatarContainer: {
    width: '100%',
    display: 'flex',
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: {
    width: 50, 
    height: 50, 
    borderRadius: 100, 
    marginRight: 5,
  },
  nameInfo: {
    fontSize: 17, 
    fontWeight: '700',  
    marginLeft: 5,
  },
  registredContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  registredText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary
  },
  commentMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  commentMenuButtonText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: 'bold',
  },
})