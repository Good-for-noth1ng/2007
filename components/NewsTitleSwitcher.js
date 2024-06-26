import { StyleSheet, Text, View, Animated, TouchableOpacity, Easing } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import * as Localization from 'expo-localization'
import {Dropdown} from 'react-native-element-dropdown'
import { COLORS } from '../constants/theme';
import { setCurrentPage } from '../redux/newsSlice';
import { useSelector, useDispatch } from 'react-redux';

const NewsTitleSwitcher = ({ isLightTheme }) => {
  const dispatch = useDispatch()
  const lang = Localization.getLocales()[0].languageCode
  const currentPage = useSelector(state => state.news.currentPage)
  const anim = React.useRef(new Animated.Value(0)).current
  const [isPressed, setIsPressed] = React.useState(false)
  const isInitRender = React.useRef(true)

  const rotation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  })
  const listHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100]
  })
  const shadow = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000]
  })

  React.useEffect(() => {
    if (!isInitRender.current) {
      setIsPressed(false)
    }
  }, [currentPage])

  React.useEffect(() => {
    if (isInitRender.current) {
      isInitRender.current = false
    } else {
      if (isPressed) {
        Animated.timing(anim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
          easing: Easing.linear
        }).start()
      } else {
        Animated.timing(anim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
          easing: Easing.linear
        }).start()
      }
    }
  }, [isPressed])

  const onShadowPress = () => {
    setIsPressed(false)
  }

  const onNewsTypePress = () => {
    setIsPressed(prev => !prev)
  }

  const onNewsOptionPress = () => {
    dispatch(setCurrentPage('News'))
  }

  const onRecommendedOptionPress = () => {
    dispatch(setCurrentPage('Recommended'))
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.title} onPress={onNewsTypePress}>
        <Text style={styles.selectedTextStyle}>
          {
            lang == 'ru' ?
            currentPage == 'News' ? 'Новости' : 'Рекоммендации' :
            currentPage 
          }
        </Text>
        <Animated.View style={{transform: [{rotate: rotation}],}}>
          <Entypo name='chevron-down' color={COLORS.white} size={20}/>
        </Animated.View>
      </TouchableOpacity>
      <Animated.View 
        style={[
          styles.dropdown, 
          {height: listHeight}, 
          isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor : COLORS.secondary}
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.optionContainer, 
            currentPage === 'News' ? 
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
            : isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.secondary}
          ]} 
          onPress={onNewsOptionPress}
        >
          <Text style={[styles.option, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>{lang == 'ru' ? 'Новости' : 'News'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.optionContainer, 
            currentPage === 'Recommended' ? 
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
            : isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.secondary}
          ]} 
          onPress={onRecommendedOptionPress}
        >
          <Text style={[styles.option, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>{lang == 'ru' ? 'Рекоммендации' : 'Recommended'}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{width: shadow, height: shadow, position: 'absolute', left: '-100%'}}>
        <TouchableOpacity style={{width: '100%', height: '100%'}} onPress={onShadowPress} activeOpacity={1}/>
      </Animated.View>
    </View>
  )
}

export default NewsTitleSwitcher

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    position: 'absolute',  
    top: -20,
    zIndex: 5,
  },
  dropdown: {
    backgroundColor: COLORS.light_smoke, 
    zIndex: 3,
    elevation: 15,
    position: 'relative',
    width: 170,
    borderRadius: 5,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 140,
    height: 40,
  },
  optionContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    backgroundColor: COLORS.light_smoke,
    paddingLeft: 10,
    borderRadius: 5,
  },
  option: {
    fontSize: 18,
    color: COLORS.black,
  },
  selectedTextStyle: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
})