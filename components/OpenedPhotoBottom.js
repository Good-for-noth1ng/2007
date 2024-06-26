import { StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../constants/theme';

const screenWidth = Dimensions.get('window').width
const OpenedPhotoBottom = ({ likes, comments, reposts, isLiked, navigation, photo, ownerId, accessToken }) => {
  const [liked, setLike] = React.useState(isLiked ? true : false)
  const [likesCount, setLikesCount] = React.useState(likes)
  // console.log('render')
  
  React.useEffect(() => {
    setLikesCount(likes)
  }, [likes])

  const onLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1)
    } else {
      setLikesCount(prev => prev + 1)
    }
    setLike(prev => !prev)
  }

  const navToReacted = () => {
    navigation.push('ReactedOnPhoto', { ownerId, photoId: photo.photoId })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onLike} onLongPress={navToReacted}>
        {
          liked ?
          <AntDesign name={'heart'} color={COLORS.primary} size={20}/> :
          <AntDesign name={'hearto'} color={COLORS.white} size={20}/>
        }
        <Text style={styles.text}>{likesCount}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button} 
        onPress={
          () => navigation.push(
            'OpenedPhoto',
            {
              photoUrl: photo.url,
              photoId: photo.photoId,
              text: photo.text,
              userId: photo.userId,
              ownerId: ownerId, 
              date: photo.date, 
              author: photo.author, 
              width: photo.props.style.width, 
              height: photo.props.style.height,
            } 
          )
        }
      >
        <MaterialCommunityIcons name={'comment-outline'} color={COLORS.white} size={20} />
        <Text style={styles.text}>{comments}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <MaterialCommunityIcons name={'share-outline'} size={22} color={COLORS.white}/>
        <Text style={styles.text}>{reposts}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default OpenedPhotoBottom

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: screenWidth, 
    paddingLeft: 15, 
    paddingRight: 15, 
    paddingBottom: 10,
  },
  text: {
    color: COLORS.white, 
    fontSize: 14
  },
  button: {
    flexDirection: 'row',
    gap: 5
  }
})