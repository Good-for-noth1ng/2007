import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'

const TopicListItem = ({isLightTheme, title, postsNum, isClosed, id, groupId, navigation, lang}) => {
  const navigateToTopic = () => {
    navigation.push('Topic', {groupId, topicId: id})
  }
  const getPostsEn = (num) => {
    if (num == 1) {
      return 'post'
    }
    return 'posts'
  }

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.background_dark}
      ]}
      activeOpacity={0.8}
      onPress={navigateToTopic}
    >
      <Text style={[styles.title, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
        {title}
      </Text>
      <Text style={styles.num}>
        {lang == 'ru' && postsNum != 1 ? 'постов:' : ''} {postsNum} {lang == 'ru' ? postsNum == 1 ? 'пост' : '' : getPostsEn(postsNum)}{isClosed ? lang == 'ru' ? ', Обсуждение закрыто' : ', Topic closed' : ''}
      </Text>
    </TouchableOpacity>
  )
}

export default TopicListItem

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  num: {
    fontSize: 14,
    color: COLORS.secondary
  }
})