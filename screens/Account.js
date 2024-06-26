import { StyleSheet, Text, View, SafeAreaView, Dimensions, ActivityIndicator, Image, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import * as Calendar from 'expo-calendar' 
import * as Localization from 'expo-localization'
import { useSelector, useDispatch } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from 'react-native-vector-icons/Octicons'
import CustomHeader from '../components/CustomHeader'
import DatePicker from 'react-native-modern-datepicker'
import OptionsListInputItem from '../components/OptionsListInputItem'
import DividerWithLine from '../components/DividerWithLine'
import Dropdown from '../components/Dropdown'
import GlobalShadow from '../components/GlobalShadow'
import { setAccountProperties } from '../redux/optionsSlice'
import { expandShadow } from '../redux/globalShadowSlice'
import { COLORS } from '../constants/theme'

const width = Dimensions.get('window').width
const Account = ({navigation}) => {
  const dispatch = useDispatch()
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const userInfo = useSelector(state => state.user)
  const lang = Localization.getLocales()[0].languageCode
  const accessToken = userInfo.accessToken
  const userPhotoUrl = userInfo.userProfileDrawerPhotoUrl
  const userName = `${userInfo.firstName} ${userInfo.lastName}`
  const userId = userInfo.userId
  
  // const listItemsData = useSelector(state => state.options.account.items)
  const [isLoading, setIsloading] = React.useState(true)
  const [firstName, setFirstName] = React.useState()
  const [lastName, setLastName] = React.useState()
  const [screenName, setScreenName] = React.useState()
  const [gender, setGender] = React.useState()
  const [birthday, setBirthday] = React.useState()
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [hometown, setHometown] = React.useState('')
  const [status, setStatus] = React.useState('')
  const [relationStatus, setRelationStatus] = React.useState()
  const [bdateVis, setBdateVis] = React.useState()
  const [phoneNum, setPhoneNum] = React.useState()
  const dropdownCoords = React.useRef()
  
  const curDate = new Date()
  const year = curDate.getFullYear() - 14
  const maxDate = `${year}-01-01`

  const fetchSettings = async () => {
    const getAccountSettingsUrl = `https://api.vk.com/method/account.getProfileInfo?access_token=${accessToken}&v=5.131`
    const res = await fetch(getAccountSettingsUrl)
    const data = await res.json()
    const date = data.response.bdate.split('.')
    const year = date[2]
    let month = date[1]
    if (month.length === 1) {
      month = '0' + month
    } 
    let day = date[0]
    if (day.length === 1) {
      day = '0' + day
    }
    setHometown(data.response.home_town)
    setFirstName(data.response.first_name)
    setLastName(data.response.last_name)
    setScreenName(data.response.screen_name)
    setGender(data.response.sex)
    setBirthday(`${year}-${month}-${day}`)
    setBdateVis(data.response.bdate_visibility)
    setStatus(data.response.status)
    setRelationStatus(`${data.response.relation}`)
    setPhoneNum(data.response.phone)
    setIsloading(false)
  }

  React.useEffect(() => {
    fetchSettings()
  }, [])

  const openDropdown = () => {
    dropdownCoords.current.measure(
      (x, y, width, height, pageX, pageY) => {
        dispatch(expandShadow({dropdownX: pageX, dropdownY: pageY - 60, data: {curStatus: relationStatus, setNewStatus: setRelationStatus}, dropdownType: 'relation'}))
      }
    )
  }

  const goBack = () => {
    navigation.pop()
  }

  const getRelStatus = (status) => {
    switch (status) {
      case '0':
        return lang == 'ru' ? 'Не указано' : 'Unset'
      case '1':
        return lang == 'ru' ? 'Не замужем / не женат' : 'Not Married'
      case '2':
        return lang == 'ru' ? 'Есть друг / подруга' : 'Have a friend'
      case '3':
        return lang == 'ru' ? 'Помолвлен / помолвлена' : 'Engaged'
      case '4':
        return lang == 'ru' ? 'Замужем / женат' : 'Married'
      case '5':
        return lang == 'ru' ? 'Всё сложно' : "It's complicated"
      case '6':
        return lang == 'ru' ? 'В активном поиске' : 'Actively search'
      case '7':
        return lang == 'ru' ? 'Влюблен / влюблена' : 'In Love'
      case '8':
        return lang == 'ru' ? 'В гражданском браке' : 'Live Together'
    }
  }

  const applyChange = () => {

  }

  return (
    <SafeAreaView style={[{flex: 1}, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader
        isLightTheme={isLightTheme}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        headerName={<Text style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}}>{lang == 'ru' ? 'Аккаунт' : 'Account'}</Text>}
        iconTouchHandler={goBack}
        rightsideIconComponent={<Octicons name='check' color={COLORS.white} size={30}/>}
      />
      <Modal 
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        transparent={true}
        style={{justifyContent: 'center'}}
      >
        <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
          <DatePicker
            onSelectedChange={date => setBirthday(date)}
            options={{
              backgroundColor: isLightTheme ? COLORS.white : COLORS.primary_dark,
              mainColor: isLightTheme ? COLORS.primary : COLORS.white,
              selectedTextColor: isLightTheme ? COLORS.white : COLORS.secondary,
              textDefaultColor: isLightTheme ? COLORS.primary : COLORS.primary_text,
              textHeaderColor: isLightTheme ? COLORS.primary : COLORS.primary_text,
              lang: lang
            }}
            mode="date"
            onDateChange={(date) => {
              setBirthday(date)
            }}
            minimumDate="1901-01-01"
            maximumDate={maxDate}
            current={birthday} //year-month-day
            selected={birthday}
            style={{borderRadius: 5, justifyContent: 'center', width: '98%', height: '50%', elevation: 10}}
          />
        </View>
        
      </Modal>
      {
        isLoading ?
        <View style={styles.spinnerContainer}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[
            {marginLeft: 5, marginRight: 5}, 
            // isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}
          ]}
        > 
          <DividerWithLine dividerHeight={5}/>
          <DividerWithLine dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark} dividerWidth={'100%'} dividerHeight={10} borderTL={5} borderTR={5}/>
          <View style={[{flexDirection: 'row', paddingLeft: 10, paddingRight: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Image source={{uri: userPhotoUrl}} style={styles.userImg}/>
            <View style={styles.userInfoTextContainer}>
              <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.secondary}]}>{userName}</Text>
              <Text style={styles.id}>ID: {userId}</Text>
            </View>
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>{lang == 'ru' ? 'Номер телефона' : 'Phone Number'}</Text>
            <View
              style={[
                {
                  width: '100%',
                  height: 45,
                  fontSize: 17,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10,
                  justifyContent: 'center'
                },
                isLightTheme ? {
                  borderColor: COLORS.light_smoke,
                  color: COLORS.background_dark.black,
                  backgroundColor: COLORS.very_light_gray,
                } : {
                  borderColor: COLORS.primary_dark,
                  color: COLORS.primary_text,
                  backgroundColor: COLORS.very_dark_gray,
                }
              ]}
              // selectionColor={COLORS.secondary}
              // value={phoneNum}
              // onChangeText={setFirstName}
            >
              <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
                {phoneNum}
              </Text>
            </View>
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>{lang == 'ru' ? 'Имя' : 'First Name'}</Text>
            <TextInput 
              style={[
                {
                  width: '100%',
                  height: 45,
                  fontSize: 17,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10
                },
                isLightTheme ? {
                  borderColor: COLORS.light_smoke,
                  color: COLORS.background_dark.black,
                  backgroundColor: COLORS.very_light_gray,
                } : {
                  borderColor: COLORS.primary_dark,
                  color: COLORS.primary_text,
                  backgroundColor: COLORS.very_dark_gray,
                }
              ]}
              selectionColor={COLORS.secondary}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>{lang == 'ru' ? 'Фамилия' : 'Last Name'}</Text>
            <TextInput 
              style={[
                {
                  width: '100%',
                  height: 45,
                  fontSize: 17,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10
                },
                isLightTheme ? {
                  borderColor: COLORS.light_smoke,
                  color: COLORS.background_dark.black,
                  backgroundColor: COLORS.very_light_gray
                } : {
                  borderColor: COLORS.primary_dark,
                  color: COLORS.primary_text,
                  backgroundColor: COLORS.very_dark_gray
                }
              ]}
              selectionColor={COLORS.secondary}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>{lang == 'ru' ? 'Никнейм' : 'Nickname'}</Text>
            <TextInput 
              style={[
                {
                  width: '100%',
                  height: 45,
                  fontSize: 17,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10
                },
                isLightTheme ? {
                  borderColor: COLORS.light_smoke,
                  color: COLORS.background_dark.black,
                  backgroundColor: COLORS.very_light_gray,
                } : {
                  borderColor: COLORS.primary_dark,
                  color: COLORS.primary_text,
                  backgroundColor: COLORS.very_dark_gray,
                }
              ]}
              selectionColor={COLORS.secondary}
              value={screenName}
              onChangeText={setScreenName}
            />
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>
              {lang == 'ru' ? 'Пол' : 'Gender'}
            </Text>
            <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity 
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
                onPress={() => setGender(1)}
                activeOpacity={0.8}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.light_smoke, width: 20, height: 20, borderRadius: 20}}>
                  <View 
                    style={[
                      gender === 1 ? isLightTheme ? 
                      {
                        backgroundColor: COLORS.primary,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : isLightTheme ? {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.primary_dark,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      }
                    ]}
                  />
                </View>
                <Text style={{fontSize: 16, color: COLORS.secondary}}>{lang == 'ru' ? 'Женский' : 'Female'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
                onPress={() => setGender(2)}
                activeOpacity={0.8}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.light_smoke, width: 20, height: 20, borderRadius: 20}}>
                  <View 
                    style={[
                      gender === 2 ? isLightTheme ? 
                      {
                        backgroundColor: COLORS.primary,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : isLightTheme ? {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.primary_dark,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      }
                    ]}
                  />
                </View>
                <Text style={{fontSize: 16, color: COLORS.secondary}}>{lang == 'ru' ? 'Мужской' : 'Male'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
                onPress={() => setGender(0)}
                activeOpacity={0.8}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.light_smoke, width: 20, height: 20, borderRadius: 20}}>
                  <View  
                    style={[
                      gender === 0 ? isLightTheme ? 
                      {
                        backgroundColor: COLORS.primary,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : isLightTheme ? {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.primary_dark,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      }
                    ]}
                  />
                </View>
                <Text style={{fontSize: 16, color: COLORS.secondary}}>{lang == 'ru' ? 'Не указан' : 'Unknown'}</Text>
              </TouchableOpacity>
            </View>          
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>{lang == 'ru' ? 'Семейное положение' : 'Relation Status'}</Text>
            <TouchableOpacity 
              style={[
                {
                  width: '100%',
                  height: 45,
                  fontSize: 17,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10
                },
                isLightTheme ? {
                  borderColor: COLORS.light_smoke,
                  color: COLORS.background_dark.black,
                  backgroundColor: COLORS.very_light_gray,
                } : {
                  borderColor: COLORS.primary_dark,
                  color: COLORS.primary_text,
                  backgroundColor: COLORS.very_dark_gray,
                }
              ]}
              onPress={openDropdown}
              // selectionColor={COLORS.secondary}
              // value={relationStatus}
              // onChangeText={setRelationStatus}
            >
              <View 
                ref={dropdownCoords}
                style={{width:'100%', height: '100%', justifyContent: 'center'}}
                collapsable={false}
              >
                <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
                  {
                    getRelStatus(relationStatus)
                  }
                </Text> 
              </View>
            </TouchableOpacity>
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>
              {lang == 'ru' ? 'День рождения' : 'Birthday'}
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              style={[
                {
                  width: '100%',
                  height: 45,
                  fontSize: 17,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10,
                  justifyContent: 'center'
                },
                isLightTheme ? {
                  borderColor: COLORS.light_smoke,
                  color: COLORS.background_dark.black,
                  backgroundColor: COLORS.very_light_gray,
                } : {
                  borderColor: COLORS.primary_dark,
                  color: COLORS.primary_text,
                  backgroundColor: COLORS.very_dark_gray,
                }
              ]}
              activeOpacity={0.8}
            >
              <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{birthday}</Text>
            </TouchableOpacity>
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>
              {lang == 'ru' ? 'Показывать дату рождения' : 'Birthday visibility'}
            </Text>
            <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity 
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}
                onPress={() => setBdateVis(1)}
                activeOpacity={0.8}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.light_smoke, width: 20, height: 20, borderRadius: 20}}>
                  <View 
                    style={[
                      bdateVis === 1 ? isLightTheme ? 
                      {
                        backgroundColor: COLORS.primary,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : isLightTheme ? {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.primary_dark,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      }
                    ]}
                  />
                </View>
                <Text style={{fontSize: 16, color: COLORS.secondary}}>{lang == 'ru' ? 'Полностью' : 'All'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}
                onPress={() => setBdateVis(2)}
                activeOpacity={0.8}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.light_smoke, width: 20, height: 20, borderRadius: 20}}>
                  <View 
                    style={[
                      bdateVis === 2 ? isLightTheme ? 
                      {
                        backgroundColor: COLORS.primary,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : isLightTheme ? {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.primary_dark,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      }
                    ]}
                  />
                </View>
                <Text style={{fontSize: 16, color: COLORS.secondary}}>{lang == 'ru' ? 'Месяц и день' : 'Month and day'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}
                onPress={() => setBdateVis(0)}
                activeOpacity={0.8}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.light_smoke, width: 20, height: 20, borderRadius: 20}}>
                  <View  
                    style={[
                      bdateVis === 0 ? isLightTheme ? 
                      {
                        backgroundColor: COLORS.primary,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : isLightTheme ? {
                        backgroundColor: COLORS.white,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      } : {
                        backgroundColor: COLORS.primary_dark,
                        width: 15,
                        height: 15,
                        borderRadius: 15
                      }
                    ]}
                  />
                </View>
                <Text style={{fontSize: 16, color: COLORS.secondary}}>{lang == 'ru' ? 'Скрыть' : "Don't show"}</Text>
              </TouchableOpacity>
            </View>          
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>{lang == 'ru' ? 'Родной город' : 'Hometown'}</Text>
            <TextInput 
              style={[
                {
                  width: '100%',
                  height: 45,
                  fontSize: 17,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10
                },
                isLightTheme ? {
                  backgroundColor: COLORS.very_light_gray,
                  borderColor: COLORS.light_smoke,
                  color: COLORS.background_dark.black
                } : {
                  borderColor: COLORS.primary_dark,
                  color: COLORS.primary_text,
                  backgroundColor: COLORS.very_dark_gray,
                }
              ]}
              selectionColor={COLORS.secondary}
              value={hometown}
              onChangeText={setHometown}
            />
          </View>
          <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <Text style={{fontSize: 17, color: COLORS.secondary}}>{lang == 'ru' ? 'Статус' : 'Status'}</Text>
            <TextInput 
              style={[
                {
                  width: '100%',
                  height: 45,
                  fontSize: 17,
                  borderRadius: 5,
                  borderWidth: 1,
                  paddingLeft: 10
                },
                isLightTheme ? {
                  backgroundColor: COLORS.very_light_gray,
                  borderColor: COLORS.light_smoke,
                  color: COLORS.background_dark.black
                } : {
                  backgroundColor: COLORS.very_dark_gray,
                  borderColor: COLORS.primary_dark,
                  color: COLORS.primary_text
                }
              ]}
              selectionColor={COLORS.secondary}
              value={status}
              onChangeText={setStatus}
            />
          </View>
          <DividerWithLine 
            dividerHeight={10} 
            dividerWidth={'100%'} 
            dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark} 
            borderBL={5} 
            borderBR={5}
          />
          <DividerWithLine dividerHeight={5}/>
        </ScrollView>
      }
      <Dropdown accessToken={accessToken} isLightTheme={isLightTheme}/>
      <GlobalShadow />
    </SafeAreaView>
  )
}

export default Account

const styles = StyleSheet.create({
  spinnerContainer: {
    width: '100%',
    height: '90%',
    justifyContent: 'center'
  },
  listLight: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.white
  },
  listDark: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.primary_dark
  },
  userInfoTextContainer: {
    justifyContent: 'center',
    marginLeft: 15
  },
  userImg: {
    width: 75,
    height: 75,
    borderRadius: 5
  },
  id: {
    fontSize: 15,
    color: COLORS.secondary
  },
  
})