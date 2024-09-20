import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, Dimensions, Animated, Platform, ToastAndroid } from 'react-native'
import React, {useState,  memo } from 'react'
import * as Clipboard from 'expo-clipboard'
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';
import { COLORS } from '../constants/theme'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Fontisio from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather'
import { postWidth } from '../constants/theme';
import ImageViewer from 'react-native-image-zoom-viewer'
import OpenedPhotoBottom from './OpenedPhotoBottom';
import { push } from '../redux/downloadSlice';
const screenWidth = Dimensions.get('window').width
const PostPhotos = ({postPhotos, navigation, ownerId, date, author, lang, accessToken}) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = React.useState(false)
  const shouldHideTopAndBottom = React.useRef(false)
  const isDropdownHidden = React.useRef(true)
  const openImageIndex = React.useRef(0)
  const imgNum = postPhotos.length
  const rowNum = Math.ceil(imgNum / 3)
  const columnNum = 3
  let grid = []
  let imagesForSlides = []
  let index = 0
  let height
  let resolution
  let totalHeight = 0
  let calcWidth

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

  const addPhotoToSaved = async () => {
    const photoId = imagesForSlides[openImageIndex.current].photoId
    const res = await fetch(`https://api.vk.com/method/photos.copy?access_token=${accessToken}&v=5.131&owner_id=${ownerId}&photo_id=${photoId}`)
    const data = await res.json()
    if (Platform.OS == "android") {
      if (data.response == 1) {
        ToastAndroid.show(lang == 'ru' ? 'Добавлено в сохраненные' : 'Added to saved', ToastAndroid.SHORT)
      } else {
        ToastAndroid.show(lang == 'ru' ? 'Ошибка соединения' : 'Connection error', ToastAndroid.SHORT)
      }
    }
    await closeDropdown(50)
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
    await Clipboard.setStringAsync(imagesForSlides[openImageIndex.current].props.source.uri)
    if (Platform.OS === "android") {
      ToastAndroid.show(lang == 'ru' ? 'Скопировано в буфер обмена' : 'Copied!', ToastAndroid.SHORT)
    }
  }

  const startDownload = async () => {
    await closeDropdown(30).then(() => {
      dispatch(push({url: imagesForSlides[openImageIndex.current].props.source.uri}))
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

  const initPhoto = (width, imageUrl, resizeMode, indexForOpen) => {
    return (
    <TouchableOpacity  
        style={{width: width, height: '100%', display: 'flex',}}  
        key={uuid.v4()} 
        onPress={() => {
          openImageIndex.current = indexForOpen
          setModalVisible(!modalVisible)
        }}
        activeOpacity={1}
      >
        <Image 
          source={{uri: imageUrl}}
          style={{width: '100%', height: '100%'}}
          // style={{flex: 1, width: null, height: null}}
          // resizeMode={'contain'}
        />
    </TouchableOpacity>)
  }

  let indexForOpen = 0
  for (let i = 0; i < rowNum; i++) {
    let row = []
    let calcImageHeights = []
    let widthOfImages = []
    let imgPerRow = 3
    let imageUrls = []
    let resizeMode
    for (let j = 0; j < columnNum; j++) {
      if (i == rowNum - 1) {
        imgPerRow = imgNum - (rowNum - 1) * 3;
        resizeMode = 'stretch' 
      }
      if (rowNum == 1) {
        imgPerRow = imgNum
        resizeMode = 'contain'
      }
      let widthPercent = 100 / imgPerRow
      let width = postWidth * (widthPercent / 100)
      widthOfImages.push(width)
      let lastIndexUrl
      if (postPhotos[index]?.sizes.length > 9) {
        lastIndexUrl = postPhotos[index]?.sizes.length - 1
      } else {
        lastIndexUrl = postPhotos[index]?.sizes.length - 1
      }
      let originHeight = postPhotos[index]?.sizes[lastIndexUrl].height
      let originWidth = postPhotos[index]?.sizes[lastIndexUrl].width
      let text = postPhotos[index]?.text
      let photoId = postPhotos[index]?.id
      let userId = postPhotos[index]?.user_id
      resolution = originHeight / originWidth
      if (originWidth !== undefined) {
        height = resolution * width
      } else {
        height = 350
      }
      // let imageUrl = postPhotos[index]?.sizes[lastIndexUrl].url
      // if (imageUrl === 'https://sun9-67.userapi.com/impg/upvqOAKZAzuDyd6RB66YTjnnRnj1sXpO9-9sYw/wAigjndoQgI.jpg?size=510x340&quality=95&crop=345,0,559,373&sign=dd24e89a515e9fe5a529f41ee9967a0a&c_uniq_tag=AbaGeU0zHtFHSCohsPZLuBdN2X0NqtbJ6_fpvbpkVuc&type=album') {
      //   console.log(postPhotos[index]?.sizes)
      // }
      let imageUrl
      for (let i = 0; i < lastIndexUrl; i++) {
        if (postPhotos[index]?.sizes[i].type === 'x') {
          imageUrl = postPhotos[index]?.sizes[i].url
        }
      }
      if (imageUrl === undefined) {
        imageUrl = postPhotos[index]?.sizes[lastIndexUrl].url
      }
      //postPhotos[index]?.sizes[lastIndexUrl].url
      imageUrls.push(imageUrl)
      calcImageHeights.push(height)
      if (imageUrl !== undefined) {
        imagesForSlides.push({url: imageUrl, text: text, photoId: photoId, userId: userId, albumId: postPhotos[index].album_id})
      }
      // let image = initPhoto(width=width, imageUrl=imageUrl)
      index += 1
      // row.push(image)
    }
    for (let k = 0; k < imgPerRow; k++) {
      let image = initPhoto(Math.max(...widthOfImages), imageUrls[k], resizeMode, indexForOpen)
      indexForOpen += 1
      row.push(image)
    }
    let rowHeight = Math.min(...calcImageHeights)
    if (rowHeight < 40) {
      rowHeight += 40 
    }
    let rowContainer = <View 
      style={{ 
        flexDirection: 'row',
        height: rowHeight ? rowHeight : 200,
        padding: 0,
      }} 
      key={uuid.v4()}>
        {row}
    </View>
    totalHeight += height
    grid.push(rowContainer)

  }
  // console.log(imagesForSlides)
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
          imageUrls={imagesForSlides}
          enableImageZoom={true}
          useNativeDriver={true}
          enablePreload={true}
          enableSwipeDown={false}
          renderIndicator={(currentIndex) => <></>}
          saveToLocalByLongPress={false}
          onChange={onPhotoChange}
          renderHeader={
            (currentIndex) => (
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
                  <Text style={{color: COLORS.white, fontSize: 17}}>{currentIndex + 1} {lang == 'ru' ? 'из' : 'of'} {imagesForSlides.length}</Text>
                </View>
                <TouchableOpacity onPress={openDropdown}>
                  <Feather name={'more-vertical'} color={COLORS.white} size={25}/>
                </TouchableOpacity>
              </Animated.View>
            )
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
                  justifyContent: 'space-between', 
                  width: screenWidth, 
                  paddingLeft: 15, 
                  paddingRight: 15, 
                  paddingBottom: 10, 
                  transform: [{translateY: moveDown}]
                }}
              >
                <TouchableOpacity onPress={startDownload}>
                  <Feather name={'plus'} color={COLORS.white} size={25} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={
                    () => navigation.push(
                      'OpenedPhoto', 
                      {
                        photoUrl: imagesForSlides[index].url,
                        photoId: imagesForSlides[index].photoId,
                        text: imagesForSlides[index].text,
                        userId: imagesForSlides[index].userId,
                        ownerId: ownerId, 
                        date: date, 
                        author: author,
                        albumId: imagesForSlides[index].albumId,  
                        width: imagesForSlides[index].props.style.width, 
                        height: imagesForSlides[index].props.style.height,
                        closeModal: onRequestClose
                      }
                    )
                  }
                >
                  <MaterialCommunityIcons name={'comment-outline'} color={COLORS.white} size={20} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialCommunityIcons name={'share-outline'} size={22} color={COLORS.white}/>
                </TouchableOpacity>
              </Animated.View>
              )
            }
          }
          onClick={performHidePhotoInfoAnim}
          onMove={closeDropdown}
          // footerContainerStyle={{tra}}
          index={openImageIndex.current}
        />
        <Animated.View style={[{transform: [{translateX: screenWidth / 2}, {translateY: 10}], paddingLeft: 5, backgroundColor: COLORS.white, width: 170, zIndex: 3, position: 'absolute', borderRadius: 5}, {height: dropdownHeight}]}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={startDownload}>
            <Text style={{fontSize: 16}}>{lang == 'ru' ? 'Скачать' : 'Download'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={copyImgLink}>
            <Text style={{fontSize: 16}}>{lang == 'ru' ? 'Копировать ссылку' : 'Copy'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={addPhotoToSaved}>
            <Text style={{fontSize: 16}}>{lang == 'ru' ? 'Добавить в сохраненные' : 'Add to saved'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
      <View style={styles.gridStyle}>
        {
          grid && grid
        }
      </View>
    </>
  )
}

export default PostPhotos

const styles = StyleSheet.create({
  gridStyle: {
    // marginBottom: 10
  }
})