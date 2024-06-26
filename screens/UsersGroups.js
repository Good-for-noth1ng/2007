import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as Localization from 'expo-localization'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import DividerWithLine from '../components/DividerWithLine'
import GroupListItem from '../components/GroupListItem';
import { COLORS } from '../constants/theme'

const UsersGroups = ({ navigation, route }) => {
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState([])
  const count = 100
  const offset = useRef(0)
  const remainToFetchNum = useRef(null)
  const { userId } = route.params
  
  const fetchUsersGroups = async () => {
    const fetchUsetrsGroupsUrl = `https://api.vk.com/method/groups.get?access_token=${accessToken}&v=5.131&extended=1&fields=activity,members_count&count=${count}&offset=${offset.current}&user_id=${userId}`
    const response = await fetch(fetchUsetrsGroupsUrl)
    const data = await response.json()
    if (remainToFetchNum.current === null) {
        remainToFetchNum.current = data.response.count - count
    } else {
        remainToFetchNum.current -= count
    }
    offset.current += count
    setGroups(prevState => prevState.concat(data.response.items))
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchUsersGroups()
  }, [])

  const fetchMoreUsersGroups = () => {
    if(remainToFetchNum.current > 0) {
      fetchUsersGroups()
    }
    // fetchUsersGroups()
  }

  const goBack = () => {
    navigation.goBack()
  }

  const renderItem = ({item}) => {
    return (
      <GroupListItem 
        data={item}
        isLightTheme={isLightTheme}
        navigation={navigation}
        lang={lang}
      />
    )
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
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Сообщества' : 'Communities'}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
      <FlatList
        style={styles.list}
        data={groups}
        renderItem={renderItem}
        ListFooterComponent={footer}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={listSeparator}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMoreUsersGroups}
        ListEmptyComponent={
          <View style={[styles.spinnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
          </View>
        }
      />
    </SafeAreaView>
  )
}

export default UsersGroups

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center'
  },
  headerTextStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  list: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
})