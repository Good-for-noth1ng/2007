import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'
//TODO: delete component
const PhotosGridChunk = ({photos, isLightTheme}) => {
  return (
    <View style={[styles.container, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
      {
        photos.data.map(photo => {
          const sizesLastIndex = photo.sizes.length - 1
          return (
            <Image 
            //   style={[styles.image, {width: photo.sizes[sizesLastIndex].width, height: photo.sizes[sizesLastIndex].height}]}
              style={{width: '32%', height: 140}}
              source={{uri: photo.sizes[sizesLastIndex].url}}
            />
          )
        })
      }
    </View>
  )
}

export default PhotosGridChunk

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '33%'
  }
})