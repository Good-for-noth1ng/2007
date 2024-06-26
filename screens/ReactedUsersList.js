import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator, FlatList } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import * as Localization from 'expo-localization'
import uuid from 'react-native-uuid'
import { useSelector } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import UserListItem from '../components/UserListItem'
import DividerWithLine from '../components/DividerWithLine'
import { COLORS } from '../constants/theme'

//TODO:
//add react-native-snap-carousel: on one page all users on another related only
const ReactedUsersList = ({ navigation }) => {
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [isLoading, setIsLoading] = useState(true)
  const [usersList, setUsersList] = useState([])
  const count = 10
  const offset = useRef(0)
  const remainToFetchNum = useRef(null)
  const commentsData = useSelector(state => state.comments)
  const ownerId = commentsData.ownerId
  const authorCommentId = commentsData.authorCommentId
  // console.log(ownerId, authorCommentId)
  

  const fetchUsersWhoReacted = async () => {
    const likesListUrl = `https://api.vk.com/method/likes.getList?access_token=${accessToken}&v=5.131&type=comment&count=${count}&offset=${offset.current}&owner_id=${ownerId}&item_id=${authorCommentId}`
    const likesListResponse = await fetch(likesListUrl)
    const likesListData = await likesListResponse.json()
    if (remainToFetchNum.current === null) {
      remainToFetchNum.current = likesListData.response.count - count
    } else {
      remainToFetchNum.current -= count 
    }
    offset.current += count
    const fetchUsersUrl = `https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.131&fields=photo_100&user_ids=${likesListData.response.items}`
    const response = await fetch(fetchUsersUrl)
    const data = await response.json()
    console.log(data.response)
    setUsersList(prevState => prevState.concat(data.response))
  }

  useEffect(() => {
    setIsLoading(true)
    fetchUsersWhoReacted()
    setIsLoading(false)
  }, [])

  const fetchMoreUsersWhoReacted = () => {
    fetchUsersWhoReacted()
  }

  const navigateBack = () => {
    navigation.goBack()
  }

  const listSeparator = () => (
    <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
  )

  const renderItem = ({item}) => {
    return (
      <UserListItem 
        imgUrl={item.photo_100}
        firstName={item.first_name}
        lastName={item.last_name}
        id={item.id}
        navigation={navigation}
        isLightTheme={isLightTheme}
        bdate={undefined}
        city={undefined}
      />
    )
  }

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
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Понравилось' : 'Reactions'}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={navigateBack}
      />
      {
        isLoading ?
        <View style={styles.spinnerContainer}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50} />
        </View> :
         usersList.length > 0 ?
          <FlatList
            style={styles.list}
            data={usersList}
            // keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={listSeparator}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={listHeader}
            ListFooterComponent={footer}
            onEndReached={fetchMoreUsersWhoReacted}
          />
          : 
          <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: COLORS.secondary, fontSize: 17, fontWeight: 'bold',}}>No reactions</Text>
          </View>
      }
      
    </SafeAreaView>
  )
}

export default ReactedUsersList

const styles = StyleSheet.create({
  headerTextStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%'
  },
  list: {
    marginLeft: 5,
    marginRight: 5,
  },
})