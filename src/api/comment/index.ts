import { Comment, CommentSort } from '~/types/comment'
import api from '..'

export type MusicCommentQuery = {
  id: number;
  limit?: number;
  offset?: number;
  before?: number;
}

export async function getMusicComment(query: MusicCommentQuery) {
  const { id, limit = 20, offset = 0, before } = query
  const limitStr = limit ? `&limit=${limit}` : ''
  const offsetStr = offset >= 0 ? `&offset=${offset}` : ''
  const beforeStr = before ? `&before=${before}` : ''

  return api.get(`/comment/music?id=${id}${limitStr}${offsetStr}${beforeStr}`)
}

type BaseCommentQuery = {
  id: number;
  type: Comment;
  PageNo?: number;
  PageSize?: number;
  sortType?: CommentSort;
  cursor?: number;
}

type CommentQuery = 
  BaseCommentQuery | 
  (Omit<BaseCommentQuery, 'sortType'> & { sortType: CommentSort.Time; cursor: number })


export async function getComment(query: CommentQuery) {
  const { id, type, PageNo = 1, PageSize = 20, sortType = CommentSort.Recommended, cursor } = query

  const cursorStr = (sortType === CommentSort.Time && cursor) ? `&cursor=${cursor}` : ''

  return api.get(`/comment/new?id=${id}&type=${type}&PageNo=${PageNo}&PageSize=${PageSize}&sortType=${sortType}${cursorStr}`)
}