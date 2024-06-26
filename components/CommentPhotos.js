import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'

const CommentPhotos = ({commentPhotos}) => {
  const imgNum = commentPhotos.length
  let images = []
  let column = []
  const photoVariants = commentPhotos[0].sizes.length
  for (let i = 0; i < commentPhotos.length; i++) {
    for (let j = 0; j < commentPhotos[i].sizes.length; j++) {
      column.push({width: commentPhotos[i].sizes[j].width, height:commentPhotos[i].sizes[j].height, uri: commentPhotos[i].sizes[j].url})
    }
    images.push(column)
    column = []
  }
  return (
    <View style={styles.photosContainer}>
        <Image source={images[0]} style={styles.photo}/>
        {images.length === 2 ? <Image source={images[1]} style={styles.photo}/> : null} 
    </View>
  )
}

export default CommentPhotos

const styles = StyleSheet.create({
  photosContainer: {
    width: '85%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: COLORS.light_smoke
  },
  photo: {
    width: '49%',
    height: '100%',
    borderRadius: 5
  }
})