import { StyleSheet, Text, View, TouchableOpacity, TextInput, BackHandler, StatusBar, Animated, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
// import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { LinearGradient } from 'expo-linear-gradient'
import { collapseShadow, expandShadow } from '../redux/globalShadowSlice';
// import NewsTitleSwitcher from './NewsTitleSwitcher'
import { COLORS } from '../constants/theme'

const globalShadowHeight = Dimensions.get('window').height

const CustomHeader = ({lang, headerName, iconTouchHandler, iconComponent, showSearchIcon, handleInputChange, navigation, isLightTheme, gapForSearchIcon, rightsideIconComponent, rightsideIconComponentTouchHandler, onCleaningInput, onOptionsButton, isScreenFromDrawerMenu}) => {
  // const dispatch = useDispatch()
  const [showSearchInputField, setShowSearchInputField] = useState(false)
  const inputField = useRef()
  const [inputFieldText, setInputFieldText] = useState('')
  // const isShadowExpanded = useSelector(state => state.globalShadow.isOpen)

  // const closeGlobalShadow = () => {
  //   dispatch(collapseShadow())
  // }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // console.log(inputField.current)
        if (inputField.current !== null && inputField.current !== undefined) {
          if ((inputField.current.isFocused() || showSearchInputField) && inputFieldText !== '') {
            inputField.current.clear()
            setInputFieldText('')
            return true
          } else if ((inputField.current.isFocused() || showSearchInputField) && inputFieldText === '') {
            inputField.current.blur()
            onCleaningInput()
            setShowSearchInputField(false)
            return true
          }
        } else {
          if (isScreenFromDrawerMenu) {
            navigation.openDrawer()
            return true
          } else {
            return false
          }

        }
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
      
    }, [inputField.current, inputFieldText])
  )

  const handleSearchIconPress = () => {
    setShowSearchInputField(true)
  }

  const initFocusOnField = () => {
    if (inputField.current) {
      inputField.current.focus()
    }
  }

  const blurInput = () => {
    setShowSearchInputField(false)
  }

  const clearInputField = () => {
    inputField.current.clear()
    if (onCleaningInput !== undefined) {
      onCleaningInput()
    }
  }

  const handlingChanges = (text) => {
    setInputFieldText(text)
    handleInputChange(text)
  }

  const openOptions = () => {
    inputField.current.blur()
    onOptionsButton()
  }

  return (
    <>
      <StatusBar backgroundColor={COLORS.black} barStyle={COLORS.white} animated={true} />
      {/* {
        isShadowExpanded ?
        <TouchableOpacity 
          activeOpacity={1}
          onPress={closeGlobalShadow}
          style={{width: '100%', height: globalShadowHeight, zIndex: 4, position: 'absolute'}}
        />
        : null
      } */}
      <LinearGradient 
        style={styles.headerContainer} 
        colors={isLightTheme ? [COLORS.gradientHeaderStart, COLORS.gradientHeaderEnd] : [COLORS.primary_dark, COLORS.black]}>
        {
          showSearchInputField ?
          <View style={styles.inputFieldContainer}>
            <View style={[styles.inputFieldInnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.background_dark}]}> 
              <TouchableOpacity style={styles.inputButtonsContainer} onPress={blurInput}>
                <AntDesign name='arrowleft' size={20} color={COLORS.secondary}/>
              </TouchableOpacity>  
              <TextInput
                style={[styles.inputField, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]} 
                ref={inputField}
                onLayout={initFocusOnField}
                selectionColor={COLORS.secondary}
                placeholder={lang == 'ru' ? 'Поиск' : 'Search'}
                placeholderTextColor={COLORS.smoke}
                onChangeText={handlingChanges}
                autoCapitalize='none'
                value={inputFieldText}
              />
              <View style={{width: 70, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <TouchableOpacity onPress={clearInputField}>
                  <AntDesign name='close' size={20} color={COLORS.secondary}/>
                </TouchableOpacity>
                {
                  onOptionsButton && (
                    <TouchableOpacity onPress={openOptions}>
                      <Ionicons name='options-outline' size={20} color={COLORS.secondary}/>
                    </TouchableOpacity>
                  )
                }
              </View>
            </View>
          </View> :
          <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 35}}>
              <TouchableOpacity activeOpacity={1} style={styles.iconContainer} onPress={iconTouchHandler}>
                {iconComponent}
              </TouchableOpacity>
              <View>
                {headerName}
              </View>
            </View>
            {
              rightsideIconComponent ?
              <TouchableOpacity activeOpacity={1} onPress={rightsideIconComponentTouchHandler && rightsideIconComponentTouchHandler}>
                {rightsideIconComponent}
              </TouchableOpacity> :
              null
            }
            {
              showSearchIcon && !showSearchInputField ? 
              <TouchableOpacity onPress={handleSearchIconPress}>
                <FontAwesome name='search' size={20} color={COLORS.white}/>
              </TouchableOpacity>
              : null
            }
          </View>
        }  
      </LinearGradient>
    </>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    zIndex: 3
  },
  inputFieldContainer: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  inputFieldInnerContainer: {
    width: '85%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
  },
  inputField: {
    width: '65%',
    height: '100%',
    fontSize: 17,
  },
  inputButtonsContainer: { 
    width: '12%', 
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },  
  iconContainer: {
    // marginLeft: 15,
    // marginRight: 35,
  },
  searchIcon: {
    marginLeft: '35%'
  },
 

})