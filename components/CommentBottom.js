import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { COLORS } from '../constants/theme'
import { getTimeDate } from '../utils/date'
import { getShortagedNumber } from '../utils/numShortage'
const CommentBottom = ({likesCount, handleLikePress, date, isLiked, lang}) => {
  return (
    <View style={styles.commentBottomContainer}>
      <View style={styles.dateReplyContainer}>
        <Text style={styles.date}>{getTimeDate(date, lang)}</Text>
        <Text style={styles.replyButton}>{lang == 'ru' ? 'Ответить' : 'Reply'}</Text>
      </View>
      <TouchableOpacity activeOpacity={1} style={styles.likeOpacityArea} onPress={handleLikePress}>
        {
          isLiked ?
            <>
              <FontAwesome name='heart'  color={COLORS.primary} size={13}/>
              <Text style={styles.likesNumberText}>{getShortagedNumber(likesCount)}</Text>
            </> :
            <>
              <FontAwesome name='heart-o'  color={COLORS.secondary} size={13} />
              <Text style={styles.likesNumberText}>{getShortagedNumber(likesCount)}</Text>
            </>
        }
      </TouchableOpacity>
    </View>
  )
}

export default CommentBottom

const styles = StyleSheet.create({
  commentBottomContainer: {
    width: '95%', 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  }, 
  likeOpacityArea: {
    width: 28, 
    display:'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    
  },
  dateReplyContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  date: {
    color: COLORS.secondary, fontSize: 13
  },
  replyButton: {
    marginLeft: 10, 
    color: COLORS.secondary, 
    fontWeight: '700', 
    fontSize: 13,
  },
  likesNumberText: {
    fontSize: 12,
    color: COLORS.secondary
  }, 
})