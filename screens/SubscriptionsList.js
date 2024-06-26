import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import * as Localization from 'expo-localization'
import { useSelector } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import UserListItem from '../components/UserListItem'
import GroupListItem from '../components/GroupListItem'
import DividerWithLine from '../components/DividerWithLine'
import { COLORS } from '../constants/theme'


const SubscriptionsList = ({ navigation, route }) => {
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [subscriptions, setSubscriptions] = useState([])
  const count = 30
  const offset = useRef(0)
  const remainToFetchNum = useRef(null)
  const { userId } = route.params
  const urlFields = 'activity,bdate,members_count,city,photo_100'

  const fetchSubscriptions = async () => {
    const fetchSubscriptionsUrl = `https://api.vk.com/method/users.getSubscriptions?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&user_id=${userId}&fields=${urlFields}&extended=1`
    const response = await fetch(fetchSubscriptionsUrl)
    const data = await response.json()
    if (remainToFetchNum.current === null) {
      remainToFetchNum.current = data.response.count - count
    } else {
      remainToFetchNum.current -= count
    }
    offset.current += count
    setSubscriptions(prevState => prevState.concat(data.response.items))
  }

  React.useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchMoreSubscriptions = () => {
    console.log('mores subs')
    if (remainToFetchNum.current > 0) {
      fetchSubscriptions()
    }
  }

  const renderItem = ({item}) => {
    if (item.name !== undefined) {
      return (
        <GroupListItem isLightTheme={isLightTheme} navigation={navigation} data={item} lang={lang}/>
      )
    } else {
      return (
        <UserListItem 
          isLightTheme={isLightTheme} 
          navigation={navigation}
          imgUrl={item.photo_100}
          firstName={item.first_name}
          lastName={item.last_name}
          id={item.id}
          bdate={item.bdate}
          city={item.city} 
          lang={lang}
        />
      )
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  const listSeparator = () => (
    <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
  )

  const listHeader = () => {
    return (
      <DividerWithLine 
        dividerHeight={10} 
        marginT={10} 
        borderTL={5} 
        borderTR={5} 
        dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
      />  
    )
  }

  const footer = () => {
    if (remainToFetchNum.current > 0) {
      return (
        <>
          <View style={[{justifyContent: 'center'}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColorL: COLORS.primary_dark}]}>
            <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={40}/>
          </View>
          <DividerWithLine 
            dividerHeight={5} 
            marginB={10} 
            borderBL={5} 
            borderBR={5} 
            dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
          />
        </>
      )
    }
    return (
      <DividerWithLine 
        dividerHeight={10} 
        marginB={10} 
        borderBL={5} 
        borderBR={5} 
        dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
      />
    )
  }

  return (
    <SafeAreaView style={[{flex: 1}, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        isLightTheme={isLightTheme}
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Подписки' : 'Subscriptions'}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
          <FlatList
            style={styles.list} 
            data={subscriptions}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={footer}
            ListHeaderComponent={listHeader}
            ItemSeparatorComponent={listSeparator}
            onEndReached={fetchMoreSubscriptions}
            ListEmptyComponent={
              <View style={[styles.spinnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
                <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
              </View>
            }
           />
    </SafeAreaView>
  )
}

export default SubscriptionsList

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%'
  },
  headerTextStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  list: {
    marginLeft: 5,
    marginRight: 5,
  },
})