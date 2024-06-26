import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import CustomHeader from '../components/CustomHeader'
import { FlatList } from 'react-native-gesture-handler'
import AntDesign from 'react-native-vector-icons/AntDesign'
import GiftItem from '../components/GiftItem'
import { COLORS } from '../constants/theme'

const height = Dimensions.get('window').height - 60
const Gifts = ({ navigation, route }) => {
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [isLoading, setIsLoading] = React.useState(true)
  const [giftsList, setGiftsList] = React.useState(null)
  const { ownerId } = route.params
  const count = 5
  const offset = React.useRef(0)
  const giftsCount = React.useRef(0)
  

  const fetchGifts = async () => {
    const getGiftsUrl = `https://api.vk.com/method/gifts.get?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&user_id=${ownerId}`
    const res = await fetch(getGiftsUrl)
    const data = await res.json()
    if (data.response.count > 0) {
      giftsCount.current = data.response.count
      const ids = ','.concat(data.response.items.map(item => `${item.from_id}`))
      const getUsersUrl = `https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.131&user_ids=${ids}&fields=photo_100`
      const usersRes = await fetch(getUsersUrl)
      const usersData = await usersRes.json()
      let gifts = []
      for (let i = 0; i < data.response.items.length; i++) {
        user = usersData.response.find(user => user?.id === data.response?.items[i]?.from_id)
        gifts.push({
          author: {
            name: `${user?.first_name} ${user?.last_name}`,
            photo: user?.photo_100,
            id: data.response?.items[i]?.from_id
          },
          gift: data.response.items[i].gift,
          privacy: data.response.items[i].privacy,
          message: data.response.items[i].message,
          id: data.response.items[i].id,
          date: data.response.items[i].date
        })
      }
      offset.current += count
      setGiftsList(gifts)
      setIsLoading(false)
    } else {
      setGiftsList([])
    }
  }

  const fetchMore = async () => {
    const getGiftsUrl = `https://api.vk.com/method/gifts.get?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&user_id=${ownerId}`
    const res = await fetch(getGiftsUrl)
    const data = await res.json()
    if (data.response.count > 0) {
      const ids = ','.concat(data.response.items.map(item => `${item.from_id}`))
      const getUsersUrl = `https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.131&user_ids=${ids}&fields=photo_100`
      const usersRes = await fetch(getUsersUrl)
      const usersData = await usersRes.json()
      let gifts = []
      for (let i = 0; i < data.response.items.length; i++) {
        user = usersData.response.find(user => user?.id === data.response?.items[i]?.from_id)
        gifts.push({
          author: {
            name: `${user?.first_name} ${user?.last_name}`,
            photo: user?.photo_100,
            id: data.response?.items[i]?.from_id
          },
          gift: data.response.items[i].gift,
          privacy: data.response.items[i].privacy,
          message: data.response.items[i].message,
          id: data.response.items[i].id,
          date: data.response.items[i].date
        })
      }
      offset.current += count
      setGiftsList(prev => prev.concat(gifts))
    }
  }

  React.useEffect(() => {
    fetchGifts()
  }, [])


  const renderItem = ({item}) => {
    return (
      <GiftItem 
        author={item.author}
        date={item.date}
        gift={item.gift}
        message={item.message}
        isLightTheme={isLightTheme}
        navigation={navigation}
      />
    )
  }

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={[{flex: 1}, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        isLightTheme={isLightTheme}
        iconTouchHandler={goBack}
        headerName={<Text style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}}>Gifts</Text>}
        isScreenFromDrawerMenu={false}
        navigation={navigation}
      />
      {
        isLoading ? 
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={50} color={isLightTheme ? COLORS.primary : COLORS.white}/>
        </View> : 
        <FlatList 
          data={giftsList}
          renderItem={renderItem}
          style={{marginLeft: 5, marginRight: 5}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{alignItems: 'center', justifyContent: 'center', height: height}}>
              <Text style={[{fontSize: 17, fontWeight: 'bold'}, {color: COLORS.secondary}]}>
                No gifts yet
              </Text>
            </View>
          }
          ListFooterComponent={
            giftsList && giftsList.length < giftsCount.current ?
            <View>
              <ActivityIndicator size={40} color={isLightTheme ? COLORS.primary : COLORS.white}/>
            </View> : null
          }
          onEndReached={fetchMore}
        />
      }
    </SafeAreaView>
  )
}

export default Gifts

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})