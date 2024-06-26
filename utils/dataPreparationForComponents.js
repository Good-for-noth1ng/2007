import uuid from 'react-native-uuid';

export const cleanAdditionalInfoLinksAndUsers = (links, contacts, contactsDetailed) => {
  let cleanedLinks, cleanedUsers
  if (links) {
    cleanedLinks = links.map(link => ({...link, key: uuid.v4()}))
        // console.log(cleanedLinks)
  }
  if (contacts && contactsDetailed) {
    cleanedUsers = contacts.map(contact => (
      {
        ...contactsDetailed.find(contactDetailed => contactDetailed.id === contact.user_id), 
        desc: contact.desc,
        key: uuid.v4()
      }
    ))
  }
  return {cleanedLinks, cleanedUsers}
}

export const convertLinkToPost = (link, profiles, groups) => {
  const key = uuid.v4()
  return {
    date: link.added_date,
    author: {
      shouldRemoveHeader: true
    },
    comments: {
      count: 0,
      can_post: 0,
      groups_can_post: 0
    },
    likes: {
      count: 0,
      can_like: 0,
      can_publish: 0,
      user_likes: 0
    },
    attachments: [{...link, type: 'link'}],
    type: 'link',
    is_favorite: link.link.is_favorite,
    key: key,
    shouldRemoveBottom: true
  }
}

export const convertArticleToPost = (item, profiles, groups) => {
  const key = uuid.v4()
  return {
    date: item.article.published_date,
    author: {
      name: item.article.owner_name,
      photo_100: item.article.owner_photo,
      id: item.article.owner_id > 0 ? item.article.owner_id : -item.article.owner_id 
    },
    comments: {
      count: 0,
      can_post: 0,
      groups_can_post: 0
    },
    likes: {
      count: 0,
      can_like: 0,
      can_publish: 0,
      user_likes: 0
    },
    reposts: {
      count: item.article.shares,
    },
    views: {
      count: item.article.views
    },
    attachments: [{...item.article, type: 'article'}],
    type: 'article',
    is_favorite: item.article.is_favorite,
    key: key
  }
}

export const findPostAuthor = (item, profiles, groups) => {
  let repost
  if (item.copy_history !== undefined) {
    repost = findPostAuthor(item.copy_history[0], profiles, groups)
  }
  let author = profiles.find(profile => profile.id === item.from_id || profile.id === item.source_id)
  const signer = profiles.find(profile => profile.id === item.signer_id)
  if (author === undefined) {
    author = groups.find(group => group.id === (-1 * item.from_id) || group.id === (-1 * item.source_id))
  }
  const key = uuid.v4()
  return {
    ...item,
    author,
    key,
    signer,
    copy_history: repost ? [repost] : undefined
  }
}