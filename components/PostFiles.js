import { StyleSheet, Text, View, TouchableOpacity, Platform, Image, Modal, Dimensions, Animated, ToastAndroid } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid';
import * as Clipboard from 'expo-clipboard'
import { useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ImageViewer from 'react-native-image-zoom-viewer'
import { push } from '../redux/downloadSlice';
import { COLORS } from '../constants/theme'
import PostFile from './PostFile'

const screenWidth = Dimensions.get('window').width
const PostFiles = ({postDocs, isLightTheme, lang}) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const openImageIndex = React.useRef(0)
  const isDropdownHidden = React.useRef(true)
  const shouldHideTopAndBottom = React.useRef(false)

  const hideDropdownAnim = React.useRef(new Animated.Value(0)).current
  const hidePhotoInfoAnim = React.useRef(new Animated.Value(0)).current
  
  const dropdownHeight = hideDropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 130]
  })
  
  const moveUp = hidePhotoInfoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50]
  })

  const moveDown = hidePhotoInfoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50]
  })

  const setStatesToDeafult = async () => {
    shouldHideTopAndBottom.current = false
    isDropdownHidden.current = true
    Animated.parallel([
      Animated.timing(hidePhotoInfoAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      }),
      Animated.timing(hideDropdownAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false
      })
    ]).start()
  }

  const closeModal = async () => {
    setModalVisible(false)
  }

  const onRequestClose = async () => {
    await closeModal().then(async () => {
      await setStatesToDeafult()
    })
  }
  const copyImgLink = async () => {
    console.log(postDocs.map(doc => console.log(doc.url)))
    const urls = postDocs.map(doc => {
      if (doc.ext === 'png' || doc.ext === 'jpg' || doc.ext === 'jpeg' || doc.ext === 'gif') {
        return doc.url
      }
    })
    await Clipboard.setStringAsync(urls[openImageIndex.current])
    if (Platform.OS === "android") {
      ToastAndroid.show(lang == 'ru' ? 'Скопировано в буфер обмена' : 'Copied!', ToastAndroid.SHORT)
    }
  }

  const startDownload = async () => {
    const urls = postDocs.map(doc => {
      if (doc.ext === 'png' || doc.ext === 'jpg' || doc.ext === 'jpeg' || doc.ext === 'gif') {
        return doc.url
      }
    })
    await closeDropdown(30).then(() => {
      dispatch(push({url: urls[openImageIndex.current]}))
    })
  }

  const performHidePhotoInfoAnim = () => {
    if (isDropdownHidden.current) {
      if (shouldHideTopAndBottom.current) {
        Animated.timing(hidePhotoInfoAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start()
        shouldHideTopAndBottom.current = false
      } else {
        Animated.timing(hidePhotoInfoAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }).start()
        shouldHideTopAndBottom.current = true
      }
    } else {
      closeDropdown()
    }
  }

  const closeDropdown = async (dur=150) => {
    if (isDropdownHidden.current == false) {
      Animated.timing(hideDropdownAnim, {
        toValue: 0,
        duration: dur,
        useNativeDriver: false
      }).start()
      isDropdownHidden.current = true
    }
  }

  const openDropdown = () => {
    Animated.timing(hideDropdownAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false
    }).start()
    isDropdownHidden.current = false
  }

  const onPhotoChange = (index) => {
    openImageIndex.current = index
  }
  return (
    <>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={onRequestClose}
        hardwareAccelerated={true}
      >
        <ImageViewer 
          imageUrls={
            postDocs.map(doc => {
              if (doc.ext === 'png' || doc.ext === 'jpg' || doc.ext === 'jpeg' || doc.ext === 'gif') {
                doc.preview.photo.sizes.sort(function(a, b){return b.width - a.width})
                return {url: doc.preview.photo.sizes[0].src}
              }
            })
          }
          enableImageZoom={true}
          useNativeDriver={true}
          enablePreload={true}
          enableSwipeDown={false}
          renderIndicator={(currentIndex) => <></>}
          onChange={onPhotoChange}
          onMove={closeDropdown}
          onClick={performHidePhotoInfoAnim}
          renderHeader={
            (currentIndex) => {
              return (
                <Animated.View 
                  style={{
                    position: 'absolute', 
                    zIndex: 3, 
                    flexDirection: 'row', 
                    width: screenWidth, 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingLeft: 10, 
                    paddingRight: 10, 
                    marginTop: 10,
                    transform: [{translateY: moveUp}]
                  }}
                >
                  <View style={{flexDirection: 'row', gap: 30}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={onRequestClose}>
                      <AntDesign name={'arrowleft'} size={25} color={COLORS.white}/>
                    </TouchableOpacity>
                    <Text style={{color: COLORS.white, fontSize: 17}}>
                      {currentIndex + 1} {lang == 'ru' ? 'из' : 'of'} {
                        postDocs.map(doc => {
                          if (doc.ext === 'png' || doc.ext === 'jpg' || doc.ext === 'jpeg' || doc.ext === 'gif') {      
                            return 1
                          }
                        }).length
                      } 
                    </Text>
                  </View>
                  <TouchableOpacity onPress={openDropdown}>
                    <Feather name={'more-vertical'} color={COLORS.white} size={25}/>
                  </TouchableOpacity>
                </Animated.View>
              )
            }
          }
          renderImage={
            (props) => {
              // console.log(props.source.uri)
              return(
                <Image source={{uri: props.source.uri}} style={{flex: 1, width: null, height: null}} resizeMode={'contain'}/>
              )
            }
          }
          renderFooter={
            (index) => {
              // console.log(props)
              return (
                <Animated.View 
                  style={{
                    flexDirection: 'row', 
                    justifyContent: 'space-around', 
                    width: screenWidth, 
                    paddingLeft: 15, 
                    paddingRight: 15, 
                    paddingBottom: 10,
                    transform: [{translateY: moveDown}]
                  }}
                >
                  <TouchableOpacity onPress={startDownload}>
                    <Feather name={'plus'} color={COLORS.white} size={25}/>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialCommunityIcons name={'share-outline'} size={25} color={COLORS.white}/>
                  </TouchableOpacity>
                </Animated.View>
              )
            }
          }
          index={openImageIndex.current}
        />
        <Animated.View style={[{transform: [{translateX: screenWidth / 2}, {translateY: 10}], paddingLeft: 5, backgroundColor: COLORS.white, width: 170, zIndex: 3, position: 'absolute', borderRadius: 5}, {height: dropdownHeight}]}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={startDownload}>
            <Text style={{fontSize: 16}}>{lang == 'ru' ? 'Скачать' : 'Download'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={copyImgLink}>
            <Text style={{fontSize: 16}}>{lang == 'ru' ? 'Копировать ссылку' : 'Copy'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
      <View>
      {
        postDocs.map(doc => {
          const key = uuid.v4()
          let name = doc.title
          // name = name.slice(0, 35)
          // if (name !== doc.title) {
          //   name += '...' 
          // }
          let size = doc.size
          let quantities = ['B', 'KB', 'MB', 'GB']
          let quantity = 'B'
          for (let i =0; i < 3; i++) {
            if (size >= 1000) {
              size = Math.round(size / 10) / 100
              quantity = quantities[i + 1]
            }  
          }
          if (doc.ext === 'png' || doc.ext === 'jpg' || doc.ext === 'jpeg' || doc.ext === 'gif') {
            // console.log(doc.preview.photo.sizes[0])
            doc.preview.photo.sizes.sort(function(a, b){return b.width - a.width})
            return (
              <TouchableOpacity activeOpacity={0.8} key={doc.id} style={{width: '100%', aspectRatio: 1.5}} onPress={() => setModalVisible(!modalVisible)}>
                <Image style={{width: '100%', height: '100%'}} source={{uri: doc.preview.photo.sizes[0].src}}/>
                <Text style={{fontSize: 12, textTransform: 'uppercase', position: 'absolute', left: '75%', top: '85%', backgroundColor: COLORS.black, borderRadius: 5, padding: 3, color: COLORS.white, opacity: 0.7}}>
                  {doc.ext} {size}{quantity}
                </Text>
              </TouchableOpacity>
            ) 
          }
          return (
            <PostFile
              key={doc.access_key} 
              isLightTheme={isLightTheme} 
              postDoc={doc} 
              size={size} 
              name={name} 
              quantity={quantity}
              id={key}
            />
          )  
        })
      }
      </View>
    </>
  )
}

export default PostFiles

const styles = StyleSheet.create({
  fileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
    // backgroundColor: COLORS.light_smoke
  },
  fileInfoContainer: {
    display: 'flex',
    width: '85%',
    flexDirection: 'column',
    marginLeft: 10,
    // backgroundColor: COLORS.secondary

  },
  nameLight: {
    fontSize: 14,
    color: COLORS.black,
    // fontWeight: '700',
  },
  nameDark: {
    fontSize: 14,
    color: COLORS.primary_text,
  },
  additionalInfoLight: {
    fontSize: 13,
    color: COLORS.black
  },
  additionalInfoDark: {
    fontSize: 13,
    color: COLORS.primary_text
  },
  fileIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light_smoke,
    borderRadius: 40
  }
})