import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, ImageBackground, ToastAndroid } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { COLORS } from '../constants/theme'
import { postWidth } from '../constants/theme'

const PostLinks = ({postLinks, isLightTheme, accessToken}) => {
  const [isFavPressed, setIsFavPressed] = React.useState(0)
  const toggleFavStatus = async (postLink) => {
    if (postLink.is_favorite) {
      const url = `https://api.vk.com/method/fave.removeLink?access_token=${accessToken}&v=5.131&link_id=${postLink.id}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.response === 1) {
        setIsFavPressed(false)
        ToastAndroid.show('Removed from Favorite', ToastAndroid.SHORT)
      } else {
        console.log(data)
        ToastAndroid.show('Network Error', ToastAndroid.SHORT)
      }
    } else {
      const url = `https://api.vk.com/method/fave.addLink?access_token=${accessToken}&v=5.131&link=${postLink.url}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.response === 1) {
        setIsFavPressed(true)
        ToastAndroid.show('Added to Favorite!', ToastAndroid.SHORT)
      } else {
        ToastAndroid.show('Network Error', ToastAndroid.SHORT)
      }
    }
  }

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      {
        postLinks.map(postLink => {
          if (postLink.photo !== undefined) {
            let url, postHeight, objectUrl
            objectUrl = postLink.url
            postLink.photo.sizes.sort(function(a, b){return b.width - a.width})
            url = postLink.photo.sizes[0].url
            const key = uuid.v4()
            return (
              <TouchableOpacity key={key} activeOpacity={0.8} onPress={() => Linking.openURL(objectUrl)} style={[{borderWidth: 1, width: '100%', height: 250}, isLightTheme ? {borderColor: COLORS.light_smoke} : {borderColor: COLORS.secondary}]}>
                <ImageBackground 
                  source={{uri: url}} 
                  style={{width: '100%', height: 150}} 
                  resizeMode='cover'
                >
                  <TouchableOpacity 
                    style={{position: 'absolute', top: 5, right: 10, elevation: 10}} 
                    activeOpacity={0.8} 
                    onPress={() => toggleFavStatus(postLink)}
                  >
                    <AntDesign 
                      name={(postLink.is_favorite && isFavPressed === 0) || isFavPressed ? 'star' : 'staro'} 
                      size={25} 
                      color={(postLink.is_favorite && isFavPressed === 0) || isFavPressed ? COLORS.primary : COLORS.light_smoke}
                    />
                  </TouchableOpacity>
                </ImageBackground>
                <View style={[{padding: 10}, isLightTheme ? {backgroundColor: COLORS.white,} : {backgroundColor: COLORS.light_black}]}>
                  <Text 
                    style={
                      [{
                        fontSize: 16, 
                        fontWeight: 'bold', 
                      },
                      isLightTheme ? {color: COLORS.black} : {color: COLORS.white}
                    ]
                    }
                  >
                    {postLink.title}
                  </Text>
                  <Text style={[isLightTheme ? {color: COLORS.black} : {color: COLORS.light_smoke}]}>
                    {postLink.caption}
                  </Text>
                </View>       
              </TouchableOpacity>
            )
          } else {
            const url = postLink.url
            const title = postLink.title
            const key = uuid.v4()
            return (
              <TouchableOpacity key={key} style={styles.linkContainer} activeOpacity={0.7} onPress={() => Linking.openURL(url)}>
                <View style={styles.linkIconContainer}>
                  <Feather name='arrow-up-right' size={30} color={COLORS.secondary} />
                </View>
                <View style={styles.linkInfoContainer}>
                  <Text numberOfLines={1} style={isLightTheme ? styles.nameLight : styles.nameDark}>{title}</Text>
                  <Text numberOfLines={1} style={isLightTheme ? styles.addressLight : styles.addressDark}>{url}</Text>
                </View>
              </TouchableOpacity>     
            )
          }
        })
      }
    </View>
  )

}

export default PostLinks

const styles = StyleSheet.create({
  linkContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 5,
    marginBottom: 5,
  },
  linkIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light_smoke,
    borderRadius: 40
  },
  linkInfoContainer: {
    display: 'flex',
    width: '84%',
    flexDirection: 'column',
    marginLeft: 10,
  },
  nameLight: {
    fontSize: 14,
    color: COLORS.black,
  },
  nameDark: {
    fontSize: 14,
    color: COLORS.primary_text,
  },
  addressLight: {
    fontSize: 13,
    color: COLORS.black,
  },
  addressDark: {
    fontSize: 13,
    color: COLORS.primary_text
  }
})