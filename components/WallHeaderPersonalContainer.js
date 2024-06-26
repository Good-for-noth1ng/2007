import { StyleSheet, Text, View, Animated } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import PersonalListItem from './PersonalListItem'
import { COLORS } from '../constants/theme'
import { getUserBdate } from '../utils/date'
import { getRelationStatusByNum, getPoliticalViewsByNum, getLifeMainByNum, getAlcoholSmokingRelByNum, getPeopleMainByNum } from '../utils/getNameByKey'

const WallHeaderPersonalContainer = ({lang, personal, relation, bdate, city, interests, homeTown, education, universities, isLightTheme, expanded}) => {
  // console.log(personal)
  const anim = React.useRef(new Animated.Value(0)).current
  let universitiesList
  if (universities) {
    if (universities.length > 0) {
      universitiesList = universities.map(univer => {
        let result = ''
        if (univer.name) {
          result += univer.name
        }
        if (univer.graduation) {
          result += `, ${univer.graduation}`
        }
        if (univer.chair_name) {
          result += `, ${univer.chair_name}`
        }
        return result
        //return `${univer.name}${univer.graduation && ','} ${univer.graduation !== undefined ? univer.graduation + ',' : ''} ${univer.chair_name !== undefined  ? univer.chair_name : ''}`
      })
    }
  }
  let political, langs, lifeMain, peopleMain, smoking, alcohol, inspiredBy
  if (personal !== undefined) {
    if (personal.political) {
      political = personal.political
    }
    if (personal.langs) {
      langs = personal.langs.join(', ')
    }
    if (personal.life_main !== undefined) {
      lifeMain = personal.lifeMain
    }
    if (personal.people_main !== undefined) {
      peopleMain = personal.people_main
    }
    if (personal.alcohol !== undefined) {
      alcohol = personal.alcohol
    }
    if (personal.smoking !== undefined) {
      smoking = personal.smoking
    }
    if (personal.inspired_by !== "") {
      inspiredBy = personal.inspired_by
    }
  }
  if(!expanded) {
    return null
  }
  return (
    <View style={[styles.container]} >
      {
        bdate && <PersonalListItem title={lang == 'ru' ? 'День рождения' : 'Birth Date'} info={getUserBdate(bdate)} isLightTheme={isLightTheme}/> 
      }
      {
        homeTown && <PersonalListItem title={lang == 'ru' ? 'Родной город' : 'Home Town'} info={homeTown}/>
      }
      {
        getRelationStatusByNum(relation) !== null ? 
        <PersonalListItem title={lang == 'ru' ? 'Отношения' : 'Relationships status'} info={getRelationStatusByNum(relation)}/> : null
      }
      {
        interests && <PersonalListItem title={lang == 'ru' ? 'Интересы' : 'Interests'} info={interests}/>
      }
      {
        universitiesList && <PersonalListItem title={lang == 'ru' ? 'Университет' : 'University'} info={universitiesList}/>
      }
      {
        city !== undefined && city.title ?
        <PersonalListItem title={lang == 'ru' ? 'Город' : 'City'} info={city.title}/> :
        null
      }
      {
        political && <PersonalListItem title={lang == 'ru' ? 'Политические взгляды' : 'Political views'} info={getPoliticalViewsByNum(political)}/>
      }
      {
        langs && <PersonalListItem title={lang == 'ru' ? 'Языки' : 'Langs'} info={langs}/>
      }
      {
        lifeMain && <PersonalListItem title={lang == 'ru' ? "Главное в жизни" : 'Life Main'} info={getLifeMainByNum(lifeMain)}/>
      }
      {
        peopleMain ? <PersonalListItem title={lang == 'ru' ? 'Главное в людях' : 'People Main'} info={getPeopleMainByNum(peopleMain)}/> : null
      }
      {
        inspiredBy  ? <PersonalListItem title={lang == 'ru' ? 'Вдохновляет' : 'Inspired By'} info={inspiredBy}/> : null
      } 
      {
        smoking ? <PersonalListItem title={lang == 'ru' ? 'Отношение к курению' : 'Smoking'} info={getAlcoholSmokingRelByNum(smoking)}/> : null
      }
      {
        alcohol ? <PersonalListItem title={lang == 'ru' ? 'Отношение к алкоголю' : 'Alcohol'} info={getAlcoholSmokingRelByNum(alcohol)}/> : null
      }
    </View>
  
  )
}

export default WallHeaderPersonalContainer

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background_dark,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
    //
    // maxHeight: 'content-fit',
    // flex: 0,
  }
})