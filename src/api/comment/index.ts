import { Comment, CommentAction, CommentSort } from '~/types/comment'
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

type GETCommentQuery = 
  BaseCommentQuery | 
  (Omit<BaseCommentQuery, 'sortType'> & { sortType: CommentSort.Time; cursor: number })


export async function getComment(query: GETCommentQuery) {
  const { id, type, PageNo = 1, PageSize = 20, sortType = CommentSort.Recommended, cursor } = query

  const cursorStr = (sortType === CommentSort.Time && cursor) ? `&cursor=${cursor}` : ''

  return api.get(`/comment/new?id=${id}&type=${type}&PageNo=${PageNo}&PageSize=${PageSize}&sortType=${sortType}${cursorStr}`)
}

interface CommentLikeQuery {
  id: number;
  type: Comment;
  cid: number;
  like: boolean;
}

export async function commentLike(query: CommentLikeQuery) {
  const { id, type, cid, like } = query

  return api.post(`/comment/like?id=${id}&type=${type}&cid=${cid}&t=${Number(like)}`)
}

interface CommentQuery {
  type: Comment;
  action: CommentAction;
  id: number;
  content: string;
  commentId?: number;
}

export async function comment(query: CommentQuery) {
  const { type, action, id, content, commentId } = query
  let commentIdStr = ''

  if(action === CommentAction.Reply || action === CommentAction.Delete && commentId) {
    commentIdStr = `&commentId=${commentId}`
  }

  return api.post(`/comment?id=${id}&type=${type}&t=${action}&content=${content}${commentIdStr}`)
}