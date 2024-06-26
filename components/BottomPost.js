import { StyleSheet, Text, View, TouchableOpacity, InteractionManager } from 'react-native'
import React, {useState, useCallback, memo} from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS } from '../constants/theme'
import { getShortagedNumber } from '../utils/numShortage'
import { setOpenedPost, setScrolling } from '../redux/newsSlice'

const BottomPost = ({dataComments, dataLikes, dataReposts, openedPost, navigation, data, isLightTheme, accessToken}) => {
    // const [commentsCount, setCommentsCount] = useState(dataComments?.count !== undefined ? dataComments.count : 0)
    const [likesCount, setLikesCount] = useState(dataLikes?.count !== undefined ? dataLikes.count : 0)
    // const [repostsCount, setRepostsCount] = useState(dataReposts?.count !== undefined ? dataReposts.count : 0)
    const [isLikePressed, setIsLikePressed] = useState(false)

    const handleLikePress = () => {
      if (!isLikePressed) {
        setIsLikePressed(true)
        setLikesCount(count => count + 1)
      } else {
        setIsLikePressed(false)
        setLikesCount(count => count - 1)
      }
    }

    const openComments = () => {
      if(openedPost && data.type !== 'article') {
        const comments = dataComments?.count !== undefined ? dataComments.count : 0
        // dispatch(setOpenedPost(data))
        if (comments > 0) {
          // dispatch(setScrolling(true))
          navigation.push('OpenPost', {ownerId: data.owner_id ? data.owner_id : data.source_id, postId: data.id ? data.id : data.post_id, shouldScroll: true})
        } else {
          navigation.push('OpenPost', {ownerId: data.owner_id ? data.owner_id : data.source_id, postId: data.id ? data.id : data.post_id, shouldScroll: false})
        }
      }
    }
    const navigateToReactedUsersList = () => {
      if (data.type != 'article') {
        navigation.push('ReactedOnPostUsers', { ownerId: data.owner_id ? data.owner_id : data.source_id, postId: data.id ? data.id : data.post_id})
      }
    }
    const unactiveButtonColor = isLightTheme ? COLORS.secondary : COLORS.smoke;
    const result = (
      <View style={styles.postBottomContainer}>
        <View>
          <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={openComments}>
            <MaterialCommunityIcons style={styles.iconButton} name='comment' color={unactiveButtonColor} size={20}/>
            <Text style={styles.buttonText}>
              {getShortagedNumber(dataComments?.count !== undefined ? dataComments.count : 0)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomRightContainer}>
          <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8}>
            <FontAwesome style={styles.iconButton} name='share' color={unactiveButtonColor} size={20}/>
            <Text style={styles.buttonText}>
              {getShortagedNumber(dataReposts?.count !== undefined ? dataReposts.count : 0)}
            </Text>  
          </TouchableOpacity>  
          <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={handleLikePress} onLongPress={navigateToReactedUsersList}>
            <AntDesign style={styles.iconButton} color={isLikePressed ? COLORS.primary : unactiveButtonColor} name='like1' size={20} />
            <Text style={styles.buttonText}>{getShortagedNumber(likesCount)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
    return openedPost ? result : null
}

export default BottomPost

const styles = StyleSheet.create({
    postBottomContainer: {
        // display: 'flex',
        // paddingLeft: 0,
        // paddingRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bottomRightContainer: {
        // display: 'flex',
        // width: '33%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
    },
    buttonText: {
        // marginLeft: 3,
        color: COLORS.secondary
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // width: 45,
        height: 30,
        gap: 6
        // backgroundColor: COLORS.smoke
      },
    iconButton: {
        // marginRight: 3,
    },
})