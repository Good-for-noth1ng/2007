import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { FlatList } from "react-native-gesture-handler";
import CarouselItem from './CarouselItem'
import DividerWithLine from '../components/DividerWithLine'
import SearchResultHeaderCounter from '../components/SearchResultHeaderCounter';
import { COLORS } from '../constants/theme';

const Carousel = ({navigation, data, dataLength, type, isLightTheme, ownerId, dataLengthFetched, author, lang}) => {
  
  const renderItem = ({item}) => {
    let handlePress, cover
    if (type === 'photos') {
      handlePress = () => {
        navigation.push('AlbumPhotos', {albumId: item.id, headerName: item.title, ownerId: ownerId, author})
      }
      if (item.sizes === undefined) {
        cover = ''
      } else {
        cover = item.sizes[item.sizes.length - 1].url
      }
    } else if (type === 'videos') {
      handlePress = () => {
        navigation.push('AlbumVideos', {albumId: item.id, headerName: item.title, ownerId: ownerId})
      }
      if (item.image === undefined) {
        cover = ''
      } else {
        cover = item.image[item.image.length - 1].url
      }
    }
    return (
      <CarouselItem 
        cover={cover}
        title={item.title}
        type={type}
        num={type === 'photos' ? item.size : item.count}
        isLightTheme={isLightTheme}
        handlePress={handlePress}
        id={item.id}
        lang={lang}
      />
    )
  }

  const keyExtractor = (item) => {
    return item.id
  }

  const separator = () => {
    return (
      <DividerWithLine dividerWidth={10} dividerHeight={'100%'} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
    )
  }

  const handleShowMorePress = () => {
    if (type === 'photos') {
      navigation.push('PhotoAlbumsList', {ownerId})
    } else  if (type === 'videos'){
      navigation.push('VideoAlbumsList', {ownerId})
    }
  }

  if (data === undefined) {
    return null
  }
  return (
    <>
      <SearchResultHeaderCounter 
        isLightTheme={isLightTheme} 
        counterNum={dataLength} 
        counterName={lang == 'ru' ? 'Альбомы' :'Albums'}
        handleShowMorePress={dataLength > dataLengthFetched ? handleShowMorePress : false}
        lang={lang}
      />
      <View style={[{padding: 8}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
        <FlatList 
          data={data}
          renderItem={renderItem}
          horizontal={true}
          ItemSeparatorComponent={separator}
          showsHorizontalScrollIndicator={false}
          keyExtractor={keyExtractor}
        />
    </View>
    </>
  )
}

export default Carousel

const styles = StyleSheet.create({})