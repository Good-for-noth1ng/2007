import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import { postWidth } from '../constants/theme';
import { COLORS } from '../constants/theme';
import uuid from 'react-native-uuid';
import { getDuration } from '../utils/numShortage'

const PostVideos = ({postVideos, navigation}) => {
  const numOfCovers = postVideos.length
  const rowNum = Math.ceil(numOfCovers / 3)
  const columnNum = 3
  let grid = []
  let index = 0
  let height
  let resolution
  let totalHeight = 0
  
  const initCover = (width, imageUrl, resizeMode, item) => {
    const navToVideo = () => {
      console.log(item)
      navigation.push('Video', {
        // playerUrl: item.player, 
        // title: item.title, 
        // views: item.views, 
        ownerId: item.owner_id,
        isShortVideo: item.type === 'short_video', 
        // likes: item?.likes?.count, 
        // reposts: item?.reposts?.count, 
        // isLiked: item.is_liked, 
        // isReposted: item.is_reposted, 
        // date: item.date,
        // canAdd: item.can_add,
        // canAddToFavs: item.can_add_to_favs,
        // canComment: item.can_comment,
        // canLike: item.can_like,
        // commentsCount: item.comments,
        videoId: item.id,
        accessKey: item.access_key
      })
    }
    return (
      <TouchableOpacity  
        style={{width: width, height: '100%', justifyContent: 'flex-end', alignItems: 'flex-end',}}  
        key={uuid.v4()} 
        onPress={navToVideo}
        activeOpacity={1}
       >
        <Image 
          source={{uri: imageUrl}}
          style={{width: '100%', height: '100%'}}
          // style={{width: null, height: null, flex: 1}}
          // resizeMode={'contain'}
        />
        <View style={{position: 'absolute', zIndex: 2, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',}}>
          <View style={{backgroundColor: COLORS.light_black, opacity: 0.9, borderRadius: 5}}>
            <Entypo name='triangle-right' color={COLORS.white} size={40}/>
          </View>
        </View>
        <Text style={[styles.timeDuration, width < 120 && {display: 'none'}]}>{getDuration(item.duration)}</Text>
      </TouchableOpacity>
    )
  }

  for (let i = 0; i < rowNum; i++) {
    let row = []
    let calcImageHeights = []
    let widthOfImages = []
    let imgPerRow = 3
    let imageUrls = []
    let items = []
    let resizeMode
    for (let j = 0; j < columnNum; j++) {
      if (i == rowNum - 1) {
        imgPerRow = numOfCovers - (rowNum - 1) * 3;
        resizeMode = 'stretch' 
      }
      if (rowNum == 1) {
        imgPerRow = numOfCovers
        resizeMode = 'contain'
      }
      items.push(postVideos[index])
      let widthPercent = 100 / imgPerRow
      let width = postWidth * (widthPercent / 100)
      widthOfImages.push(width)
      let lastIndexUrl
      lastIndexUrl = postVideos[index]?.image.length - 1
       
      let originHeight = postVideos[index]?.image[lastIndexUrl].height
      let originWidth = postVideos[index]?.image[lastIndexUrl].width
      resolution = originHeight / originWidth
      if (originWidth !== undefined) {
        height = resolution * width
      } else {
        height = 350
      }
      let imageUrl = postVideos[index]?.image[lastIndexUrl].url
      imageUrls.push(imageUrl)
      calcImageHeights.push(height)
      index += 1
    }
    for (let k = 0; k < imgPerRow; k++) {
      let image = initCover(Math.max(...widthOfImages), imageUrls[k], resizeMode, items[k])
      row.push(image)
    }
    let rowHeight = (Math.min(...calcImageHeights) + Math.max(...calcImageHeights)) / 2
    if (rowHeight < 40) {
      rowHeight += 40 
    }
    let rowContainer = <View 
      style={{ 
        display: 'flex', 
        flexDirection: 'row',
        height: rowHeight,
        padding: 0,
      }} 
      key={uuid.v4()}>
        {row}
    </View>
    totalHeight += height
    grid.push(rowContainer)
  }
  return (
    <View>
      {grid && grid}
    </View>
  )
}

export default PostVideos

const styles = StyleSheet.create({
  timeDuration: {
    position: 'absolute', 
    zIndex: 3, 
    color: COLORS.white, 
    backgroundColor: COLORS.light_black, 
    opacity: 0.8,
    fontSize: 16,
    borderRadius: 5,
    padding: 3,
    right: 10,
    bottom: 10
  }
})