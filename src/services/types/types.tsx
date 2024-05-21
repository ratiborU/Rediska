export type TUser = {
  id: string,
  password: string,
  username: string
}

export type TAuthor = {
  id: string,
  username: string
}

export type TVote = {
  vote: number,
  user: string
}

export type TPost = {
  id: string,
  author: TAuthor,
  title: string,
  text: string,
  url: string,
  type: string,
  category: TCategory,
  created: string,
  score: number,
  views: number,
  upvotePercentage: number,
  votes: TVote[],
  comments: []
}

export type TPostInput = {
  title: string,
  text: string,
  url: string,
  type: string,
  category: TCategory
}

export type TComment = {
  id: string,
  author: TAuthor,
  body: string,
  created: string
}

export type TCommentInput = {
  body: string
}

export type TCategory = 'all' | 'music' | 'funny' | 'videos' | 'programming' | 'news' | 'fashion'

export type TCategoryObject = {
  all: string,
  music: string,
  funny: string,
  videos: string,
  programming: string,
  news: string,
  fashion: string,
}