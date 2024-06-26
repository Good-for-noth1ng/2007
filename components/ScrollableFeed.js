import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
const ScrollableFeed = () => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  
  return (
    <View>
      <Text>ScrollableFeed</Text>
    </View>
  )
}

export default ScrollableFeed

const styles = StyleSheet.create({})