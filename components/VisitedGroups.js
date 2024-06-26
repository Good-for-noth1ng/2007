import { StyleSheet, Text, View, Animated, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DividerWithLine from './DividerWithLine'
import { FlatList } from 'react-native-gesture-handler'
import { COLORS } from '../constants/theme'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const VisitedGroups = ({ visitedGroups, isLightTheme, navigation, setVisitedGroups, lang }) => {
  const [areThereVisited, setAreThereVisited] = React.useState(visitedGroups.length > 0)
  // const visited = visitedGroups

  const clearStack = async () => {
    await AsyncStorage.setItem("visitedGroups", JSON.stringify([]))
  }

  const onCrossPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setAreThereVisited(prev => !prev)
    clearStack()
  }
  
  const popGroup = async (idToDelete) => {
    const indexToDelete = visitedGroups.findIndex(item => item.id === idToDelete)
    if (indexToDelete === visitedGroups.length - 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      await AsyncStorage.setItem("visitedGroups", JSON.stringify([...visitedGroups.slice(0, visitedGroups.length-1)]))
      setVisitedGroups(prev => [...prev.slice(0, visitedGroups.length-1)])
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      await AsyncStorage.setItem("visitedGroups", JSON.stringify([...visitedGroups.slice(0,indexToDelete), ...visitedGroups.slice(indexToDelete + 1, visitedGroups.length)]))
      setVisitedGroups(prev => [...prev.slice(0,indexToDelete), ...prev.slice(indexToDelete + 1, visitedGroups.length)])
    }
    // console.log(visitedGroups.slice(0,0))
  }

  const renderItem = ({item}) => {
    const name = item.name
    return (
      <TouchableOpacity 
        style={styles.group} 
        onPress={() => navigation.push('Group', {groupId: item.id})} 
        activeOpacity={0.8}
        onLongPress={() => popGroup(item.id)}
      >
        <Image source={{ uri: item.img }} style={styles.groupImage}/>
        <Text numberOfLines={1} style={[styles.groupName, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
          {name}
        </Text>
      </TouchableOpacity>
    )
  }

  const keyExtractor = (item) => {
    return item.id
  }

  // if (!areThereVisited) {
  //   return null
  // }

  return (
    <View style={[
      styles.main, 
      isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark},
      !areThereVisited && {height: 0}
    ]}>
      <View style={styles.crossContainer}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Text style={[{fontSize: 15, fontWeight: 'bold'}, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{lang == 'ru' ? 'Посещенные' : 'Visited'}</Text>
          <Text style={[{fontSize: 15, color: COLORS.secondary}]}>{visitedGroups.length}</Text>
        </View>
        <TouchableOpacity style={styles.cross} onPress={onCrossPress}>
          <AntDesign name={'close'} color={COLORS.secondary} size={18}/>
        </TouchableOpacity>
      </View>  
      <FlatList
        data={visitedGroups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal={true}
        ItemSeparatorComponent={<View style={{width: 10}}></View>}
        showsHorizontalScrollIndicator={false}
      />
      <DividerWithLine dividerHeight={5} />
    </View>
  )
}

export default VisitedGroups

const styles = StyleSheet.create({
  main: {
    padding: 5, 
    paddingLeft: 10,
    paddingRight: 10,
    gap: 5
  },
  group: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: 60
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  groupName: {
    fontSize: 13
  },
  cross: {
    // borderRadius: 100, 
    // backgroundColor: COLORS.light_smoke, 
    width: 30, 
    height: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  crossContainer: {
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
    flexDirection: 'row'
  }
})