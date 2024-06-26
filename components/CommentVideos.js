import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const CommentVideos = ({commentVideos}) => {
  let covers = [] 
  let column = []
  for (let i = 0; i < commentVideos.length; i++) {
    for (let j = 0; j < commentVideos[i].image.length; j++) {
      column.push({width: commentVideos[i].image[j].width, height:commentVideos[i].image[j].height, uri: commentVideos[i].image[j].url})
    }
    covers.push(column)
    column = []
  } 
  return (
    <View>
      {covers.map(cover => (<Image source={cover}/>))}
    </View>
  )
}

export default CommentVideos

const styles = StyleSheet.create({})