import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import OptionsListSwitcherItem from '../components/OptionsListSwitcherItem'
import DividerWithLine from '../components/DividerWithLine';
import { setPrivacyProperties, setOwnPostsDefault, setNoWallReplies } from '../redux/optionsSlice'
import { COLORS } from '../constants/theme'


const Privacy = ({navigation}) => {
  const dispatch = useDispatch()
  const accessToken = useSelector(state => state.user.accessToken)
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const listItemsData = useSelector(state => state.options.privacy.items)
  const [isLoading, setIsLoading] = useState(true)
  const getPrivacySettingsUrl = `https://api.vk.com/method/account.getInfo?access_token=${accessToken}&v=5.131&fields=own_posts_default,no_wall_replies`

  useEffect(() => {
    fetch(getPrivacySettingsUrl)
    .then(response => response.json())
    .then(data => {
      dispatch(setPrivacyProperties({
        ...data.response,
        ownPostsDefaultHandler: setOwnPostsDefaultProperty, 
        noWallRepliesHandler: setNoWallRepliesProperty
      }))
      setIsLoading(false)
    })
  }, [])

  const setOwnPostsDefaultProperty = () => {
    dispatch(setOwnPostsDefault())
  }

  const setNoWallRepliesProperty = () => {
    dispatch(setNoWallReplies())
  }

  const goBack = () => {
    navigation.pop()
  }

  const renderItem = ({item}) => {
    if (item.type === 'switcher') {
      return (
        <OptionsListSwitcherItem 
          name={item.name}
          iconName={item.iconName}
          value={item.value}
          isLightTheme={isLightTheme}
          setNewValue={item.handler}
        />
      )
    }
  }

  const keyExtractor = (item) => {
    return item.key
  }

  return (
    <SafeAreaView style={isLightTheme ? styles.mainContainerLight : styles.manContainerDark}>
      <StatusBar backgroundColor={isLightTheme ? COLORS.primary : COLORS.primary_dark}/>
      <CustomHeader
        isLightTheme={isLightTheme}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        headerName={<Text style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}}>Privacy</Text>}
        iconTouchHandler={goBack}
      />
      {
        isLoading ?
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={50} color={isLightTheme ? COLORS.primary : COLORS.white}/>
        </View> :
        <FlatList
          data={listItemsData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          style={isLightTheme ? styles.listLight : styles.listDark}
        />
      }
    </SafeAreaView>
  )
}

export default Privacy

const styles = StyleSheet.create({
  spinnerContainer: {
    width: '100%',
    height: '90%',
    justifyContent: 'center'
  },
  mainContainerLight: {
    flex: 1,
    backgroundColor: COLORS.light_smoke
  },
  manContainerDark: {
    flex: 1,
    backgroundColor: COLORS.background_dark
  },
  listLight: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    paddingTop: 5,
    backgroundColor: COLORS.white
  },
  listDark: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    paddingTop: 5,
    backgroundColor: COLORS.primary_dark
  }
})