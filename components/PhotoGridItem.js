import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'
const PhotoGridItem = ({item, isLightTheme, id, openImage, indexForOpening}) => {
  const onPress = () => {
    indexForOpening.current = item.indexOfPhoto
    openImage()
  }
  if (item.sizes === undefined) {
    return (
      <View 
        style={
          [
            {width: '100%', height: '100%'}, 
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}
          ]
        }
      />
    )
  }
  return (
    <TouchableOpacity
      activeOpacity={0.7} 
      onPress={onPress}
      style={[
        styles.container, 
        isLightTheme ? 
        {backgroundColor: COLORS.white, borderColor: COLORS.white} : 
        {backgroundColor: COLORS.primary_dark, borderColor: COLORS.primary_dark}
      ]}
    >
      <Image 
        style={{width: '100%', height: '100%'}}
        source={{uri: item.sizes[0].url}}
      />
    </TouchableOpacity>
  )
}

// export default PhotoGridItem
export default React.memo(PhotoGridItem, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.isLightTheme === nextProps.isLightTheme
})

const styles = StyleSheet.create({
  container: {
    width: '33.33%', //33.33% 116.5px
    height: 140,  
    padding: 0,
    borderWidth: 1,
  }
})