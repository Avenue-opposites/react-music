import { Icon } from '@iconify-icon/react'
import clsx from 'clsx'
import { format } from 'date-fns'
import { Fragment, memo } from 'react'
import toast from 'react-hot-toast'
import { useToggle } from 'react-use'
import { comment, commentLike } from '~/api/comment'
import { Comment as CommentType, CommentAction } from '~/types/comment'
import CommentInput, { SendHandler } from '../Inputs/CommentInput'
import Avatar from '../Avatar/Avatar'
import ConfirmModal from '../Modal/ConfirmModal'
import { Comment, User } from '../Player/SongDetails'

export type CommentHandler = (id: number) => void

export interface BeReplied {
  beRepliedCommentId: number;
  content: string;
  user: User;
}
export interface SongCommentProps {
  id: number;
  songId: number;
  beReplied: BeReplied[] | null;
  isOwner: boolean;
  content: string;
  time: number;
  replyCount: number;
  likedCount: number;
  liked: boolean;
  ip: string;
  timeStr: string;
  user: any;
  isComment: boolean;
  onComment: CommentHandler;
  onShowReplyComment: (id: number) => void;
  avatarFrameSrc?: string;
  children?: (beReplied: BeReplied) => React.ReactNode;
  onReplyComment?: (comment: Comment) => void;
}

const SongComment: React.FC<SongCommentProps> = memo(({
  id,
  songId,
  isOwner,
  beReplied,
  content,
  time,
  replyCount,
  likedCount,
  liked,
  ip,
  timeStr,
  user,
  avatarFrameSrc,
  isComment,
  onComment,
  onShowReplyComment,
  onReplyComment,
  children,
}) => {
  const [isOpen, toggle] = useToggle(false)
  const [isLiked, toggleLike] = useToggle(liked)
  const associatorIcon = user.vipRights?.associator?.iconUrl
  const musicPackageIcon = user.vipRights?.musicPackage?.iconUrl
  const isShowExactTime = (new Date(time).getDay() + 1) - (new Date().getDay() + 1) > 0
  const IP = ip || '未知'
  const placeholder = `回复 @${user.nickname}：`
  const exactTime = format(new Date(time), 'HH:mm')

  const handleCommentSend: SendHandler = (content) => {
    return comment({
      id: songId,
      type: CommentType.Song,
      action: CommentAction.Reply,
      content,
      commentId: id
    })
      .then(({ data }) => {
        onReplyComment && onReplyComment(data.comment)
        toast.success('回复成功')
      })
      .catch(() => toast.error('回复失败'))
  }

  const handleLike = () => {
    commentLike({
      id: songId,
      cid: id,
      type: CommentType.Song,
      like: !isLiked
    })
      .then(({ data }) => {
        if (data.code === 200) {
          toggleLike()
          toast.success('点赞成功')
        }
      })
      .catch(() => toast.error('点赞失败'))
  }

  const handleComment = () => {
    onComment(id)
  }

  const handleDeleteComment = () => {
    comment({
      id: songId,
      type: CommentType.Song,
      action: CommentAction.Delete,
      commentId: id,
      content
    }).then(() => {
      toast.success('删除成功')
    }).catch(() => toast.error('删除失败'))
    .finally(() => toggle(false))
  }

  return (
    <Fragment>
      <ConfirmModal 
        isOpen={isOpen} 
        onConfirm={handleDeleteComment}
        onClose={() => toggle(false)
      }>
        <h1 className="text-lg">确认要删除这条评论吗？</h1>
      </ConfirmModal>
      <li className="flex items-start gap-x-4">
        {/* 头像 */}
        <Avatar
          className="mt-4"
          src={user.avatarUrl}
          alt={user.nickname}
          avatarFrameSrc={avatarFrameSrc}
        />
        <div className="w-full border-b pb-4">
          <div>
            <div className="flex justify-between">
              <div className="flex items-center gap-x-1">
                <h3 className="text-sky-500 hover:text-sky-700">{user.nickname}</h3>
                {associatorIcon && <span className="w-14 h-5 bg-[length:56px_20px] bg-no-repeat" style={{ backgroundImage: `url(${associatorIcon})` }} />}
                {musicPackageIcon && <span className="w-4 h-4 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${musicPackageIcon})` }} />}
              </div>
              <span className="text-sm text-gray-500">IP：{IP}</span>
            </div>
            <p className="pr-4 leading-loose text-justify">{content}</p>
            {beReplied && children?.(beReplied[0])}
          </div>
          <div className="w-full flex justify-between">
            <div>
              <span className="text-xs text-gray-500">{timeStr}&nbsp;&nbsp;{isShowExactTime && exactTime}&nbsp;&nbsp;</span>
              {
                replyCount > 0 && (
                  <span onClick={() => onShowReplyComment(id)} className="cursor-pointer inline-flex items-center text-xs text-sky-900">
                    {replyCount}条回复
                    <Icon className="rotate-180" icon="material-symbols:arrow-back-ios-new-rounded" />
                  </span>
                )
              }
            </div>
            <div className="inline-flex gap-x-4 items-center">
              <span onClick={handleLike} className={clsx('inline-flex cursor-pointer gap-x-1 items-center', isLiked ? 'text-sky-500 animate-jump-once' : 'text-sky-900')}>
                <Icon icon="ph:thumbs-up-duotone" />
                {likedCount > 0 && <span>{likedCount}</span>}
              </span>
              {isOwner && <Icon onClick={() => toggle(true)} className="cursor-pointer text-sky-900" icon="mdi:comment-remove" />}
              <Icon onClick={handleComment} className={clsx('cursor-pointer', isComment ? 'text-sky-500' : 'text-sky-900')} icon="mdi:comment-processing" />
            </div>
          </div>
        </div>
      </li>
      {
        isComment &&
        <CommentInput
          onSend={handleCommentSend}
          placeholder={placeholder}
        />
      }
    </Fragment>
  )
}, arePropsEqual)

export default SongComment

function arePropsEqual(
  prevProps: SongCommentProps,
  nextProps: SongCommentProps,
) {
  return prevProps.id === nextProps.id
    && prevProps.isComment === nextProps.isComment
}