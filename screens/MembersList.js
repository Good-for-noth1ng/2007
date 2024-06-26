import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, StatusBar, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as Localization from 'expo-localization'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import UserListItem from '../components/UserListItem'
import DividerWithLine from '../components/DividerWithLine'
import { COLORS } from '../constants/theme'

//TODO: make searchfield on members 
const MembersList = ({navigation, route}) => {
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const lang = Localization.getLocales()[0].languageCode
  const [isLoading, setIsLoading] = useState(true)
  const [usersList, setUsersList] = useState([])
  const count = 10
  const offset = useRef(0)
  const remainToFetchNum = useRef(null)
  const { groupId } = route.params 
  
  const fetchMembers = async () => {
    const fetchMembersUrl = `https://api.vk.com/method/groups.getMembers?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&group_id=${groupId}&fields=name,photo_100,city,bdate`
    const membersListResponse = await fetch(fetchMembersUrl)
    const membersListData = await membersListResponse.json()
    
    if (remainToFetchNum.current === null) {
      remainToFetchNum.current = membersListData.response.count - count
    } else {
      remainToFetchNum.current -= count 
    }
    offset.current += count
    setUsersList(prevState => prevState.concat(membersListData.response.items))
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchMembers()
  }, [])

  const goBack = () => {
    navigation.goBack()
  }

  const fetchMoreMembers = () => {
    fetchMembers()
  }

  const renderItem = ({item}) => {
    return (
      <UserListItem 
        imgUrl={item.photo_100}
        firstName={item.first_name}
        lastName={item.last_name}
        id={item.id}
        navigation={navigation}
        isLightTheme={isLightTheme}
        bdate={item.bdate}
        city={item.city}
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
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Подписчики' : 'Members'}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
      {
        isLoading ? 
        <View style={styles.spinnerContainer}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
          usersList.length > 0 ? 
            <FlatList
              style={styles.list} 
              data={usersList}
              renderItem={renderItem}
              ListFooterComponent={footer}
              ListHeaderComponent={listHeader}
              ItemSeparatorComponent={listSeparator}
              showsVerticalScrollIndicator={false}
              onEndReached={fetchMoreMembers}
            /> :
            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: COLORS.secondary, fontSize: 17, fontWeight: 'bold',}}>No Members</Text>
            </View>
      }    
    </SafeAreaView>
  )
}

export default MembersList

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
    borderRadius: 5
  },
})