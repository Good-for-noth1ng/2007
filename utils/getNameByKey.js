export const getNameInGroupHeader = (key, lang) => {
  switch (key) {
    case 'audio_playlists':
      return 'audio playlists';
    case 'clips_followers':
      return 'clips followers';
    case 'market_services':
      return 'market services';
    case 'albums':
      return lang == 'ru' ? 'альбомы' : 'albums'
    case 'friends':
      return lang == 'ru' ? 'друзья' : 'friends'
    case 'gifts':
      return lang == 'ru' ? 'подарки' : 'gifts'
    case 'photos':
      return lang == 'ru' ? 'фото' : 'photos'
    case 'followers':
      return lang == 'ru' ? 'подписчики' : 'followers'
    case 'subscriptions':
      return lang == 'ru' ? 'подписки' : 'subscriptions'
    case 'videos':
      return lang == 'ru' ? 'видео' : 'videos'
    case 'articles':
      return lang == 'ru' ? 'статьи' : 'articles'
    case 'topics':
      return lang == 'ru' ? 'обсуждения' : 'topics'
    case 'wishes':
      return lang == 'ru' ? 'желания' : 'wishes'
    default:
      return key;
  }
}
    // case key === 'members':
    //   return 'members'
    // case  key === 'albums':
    //   return 'albums'
    // case key === 'audios':
    //   return 'audio'
// case key === 'photos':
    //   return 'photos'

export const getAlcoholSmokingRelByNum = (num) => {
  switch(num) {
    case 1:
      return 'резко негативное'
    case 2:
      return 'негативное'
    case 3:
      return 'компромиссное'
    case 4:
      return 'нейтральное'
    case 5:
      return 'положительное'
    default:
      return null
  }
}

export const getPeopleMainByNum = (num) => {
  switch(num) {
    case 1:
      return 'ум и креативность'
    case 2:
      return 'доброта и честность'
    case 3:
      return 'красота и здоровье'
    case 4:
      return 'власть и богатство'
    case 5:
      return 'смелость и упорство'
    case 6:
      return 'юмор и жизнелюбие'
    default:
      return null
  }
}
export const getLifeMainByNum = (num) => {
  switch(num) {
    case 1:
      return 'семья и дети'
    case 2:
      return 'карьера и развитие'
    case 3:
      return 'развлечение и отдых'
    case 4:
      return 'наука и исследования'
    case 5:
      return 'совершенствование мира'
    case 6:
      return 'саморазвитие'
    case 7:
      return 'красота и искусство'
    case 8:
      return 'слава и влияние'
    default:
      return null
  }
}

export const getPoliticalViewsByNum = (num) => {
  switch (num) {
    case 1:
      return 'коммунистические'
    case 2:
      return 'социалистические'
    case 3:
      return 'умеренные'
    case 4:
      return 'либеральные'
    case 5:
      return 'консервативные'
    case 6:
      return 'монархические'
    case 7:
      return 'ультраконсервативные'
    case 8:
      return 'индифферентные'
    case 9:
      return 'либертарианские'
    default:
      return null
  }
}
export const getRelationStatusByNum = (num) => {
  switch (num) {
    case 1:
      return 'не женат/не замужем'
    case 2:
      return 'есть друг/есть подруга'
    case 3:
      return 'помолвлен/помолвлена'
    case 4:
      return 'женат/замужем'
    case 5:
      return 'всё сложно'
    case 6:
      return 'в активном поиске'
    case 7:
      return 'влюблён/влюблена'
    case 8:
      return 'в гражданском браке'
    case 0:
      return null
    default:
      return null
  }
}