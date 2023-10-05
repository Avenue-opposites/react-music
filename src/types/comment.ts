//评论类型
export const enum Comment {
  Song,
  MV,
  Playlist,
  Album,
  RadioProgram,
  Video,
  Dynamic,
  Radio
}

//评论排序类型
export const enum CommentSort {
  //推荐
  Recommended = 1,
  //热度
  Hot,
  //时间
  Time
}

//评论操作
export const enum CommentAction {
  Delete,
  Send,
  Reply
}