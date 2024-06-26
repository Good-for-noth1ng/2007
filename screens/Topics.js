import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid';
import * as Localization from 'expo-localization'
import { useSelector } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import DividerWithLine from '../components/DividerWithLine'
import TopicListItem from '../components/TopicListItem';
import { FlatList } from "react-native-gesture-handler";
import { COLORS } from '../constants/theme'

const Topics = ({navigation, route}) => {
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [isLoading, setIsLoading] = React.useState(true)
//   const [usersList, setUsersList] = useState([])
  const [topics, setTopics] = React.useState([])
  const count = 10
  const offset = React.useRef(0)
  const remainToFetchNum = React.useRef(null)
  const { ownerId } = route.params
  
  const fetchTopics = async () => {
    const fetchTopicsUrl = `https://api.vk.com/method/board.getTopics?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&group_id=${(-1 * ownerId)}&extended=1&fields=photo_100,name`
    const response = await fetch(fetchTopicsUrl)
    const parsedResponse = await response.json()
    // console.log(parsedResponse)
    if (remainToFetchNum.current === null) {
      remainToFetchNum.current = parsedResponse.response.count - count
    } else {
      remainToFetchNum.current -= count
    }
    offset.current += count
    const items = parsedResponse.response.items.map(item => {
      const key =  uuid.v4()
      return {
        ...item,
        key
      }
    })
    setTopics(prevState => prevState.concat(items))
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchTopics()
  }, [])

  const goBack = () => {
    navigation.goBack()
  }

  const renderItem = ({item}) => {
    return (
      <TopicListItem 
        isLightTheme={isLightTheme}
        title={item.title}
        postsNum={item.comments}
        isClosed={item.is_closed}
        id={item.id}
        navigation={navigation}
        groupId={(-1 * ownerId)}
        lang={lang}
      />
    )
  }

  const listHeader = () => {
    return (
      <DividerWithLine 
        dividerHeight={5}
        dividerColor={isLightTheme ? COLORS.white : COLORS.background_dark}
        borderTL={5}
        borderTR={5}
        marginT={5}
      />
    )
  }

  const listSeparator = () => {
    return (
      <DividerWithLine 
        dividerHeight={10}
        dividerColor={isLightTheme ? COLORS.white : COLORS.background_dark}
      />
    )
  }

  const listFooter = () => {
    return (
      <DividerWithLine 
        dividerHeight={5}
        dividerColor={isLightTheme ? COLORS.white : COLORS.background_dark}
        borderBL={5}
        borderBR={5}
        marginB={5}
      />
    )
  }

  return (
    <SafeAreaView 
      style={[
        {flex: 1}, 
        isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}
      ]}
    >
      <CustomHeader 
        isLightTheme={isLightTheme}
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Обсуждения' : 'Topics'}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
      {
        isLoading ?
        <View style={[styles.spinnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
        <FlatList
          style={styles.list}
          data={topics}
          renderItem={renderItem}
          ItemSeparatorComponent={listSeparator}
          ListFooterComponent={listFooter}
          ListHeaderComponent={listHeader}
          onEndReached={fetchTopics}
          showsVerticalScrollIndicator={false} 
        />
      } 
    </SafeAreaView>
  )
}

export default Topics

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