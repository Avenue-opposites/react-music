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

type BaseGETCommentQuery = {
  id: number;
  type: Comment;
  sortType: CommentSort;
  pageNo?: number;
  pageSize?: number;
  cursor?: string;
}

type GETCommentQuery = 
  BaseGETCommentQuery | 
  (Omit<BaseGETCommentQuery, 'sortType'> & { sortType: CommentSort.Time; cursor: string })

export async function getComment(query: GETCommentQuery) {
  const { id, type, pageNo = 1, pageSize = 20, sortType, cursor } = query

  const cursorStr = (sortType === CommentSort.Time && cursor) ? `&cursor=${cursor}` : ''

  return api.get(`/comment/new?id=${id}&type=${type}&pageNo=${pageNo}&pageSize=${pageSize}&sortType=${sortType}${cursorStr}`)
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

interface BaseCommentQuery {
  type: Comment;
  action: CommentAction;
  id: number;
  content: string;
  commentId?: number;
}

type CommentQuery = 
  BaseCommentQuery |
  (Omit<BaseCommentQuery, 'action'> & { action: CommentAction.Reply; commentId: number }) |
  (Omit<BaseCommentQuery, 'action'> & { action: CommentAction.Delete; commentId: number })

export async function comment(query: CommentQuery) {
  const { type, action, id, content, commentId } = query
  let commentIdStr = ''

  if(action === CommentAction.Reply || action === CommentAction.Delete && commentId) {
    commentIdStr = `&commentId=${commentId}`
  }

  return api.post(`/comment?id=${id}&type=${type}&t=${action}&content=${content}${commentIdStr}`)
}