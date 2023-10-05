import { Icon } from '@iconify-icon/react/dist/iconify.js'
// import * as Avatar from '@radix-ui/react-avatar'
import clsx from 'clsx'
import { format } from 'date-fns'
import { Fragment, memo } from 'react'
import toast from 'react-hot-toast'
import { useToggle } from 'react-use'
import { comment, commentLike } from '~/api/comment'
import { Comment, CommentAction } from '~/types/comment'
import CommentInput, { SendHandler } from '../Inputs/CommentInput'
import Avatar from '../Avatar/Avatar'

export type CommentHandler = (id: number) => void

export interface SongCommentProps {
  id: number;
  songId: number;
  beReplied: ({
    beRepliedCommentId: number;
    content: string;
    user: any
  })[];
  isOwner: boolean;
  content: string;
  time: number;
  likedCount: number;
  liked: boolean;
  ip: string;
  timeStr: string;
  user: any;
  isComment: boolean;
  onComment: CommentHandler;
  avatarFrameSrc?: string;
}

const SongComment: React.FC<SongCommentProps> = memo(({
  id,
  songId,
  isOwner,
  beReplied,
  content,
  time,
  likedCount,
  liked,
  ip,
  timeStr,
  user,
  avatarFrameSrc,
  isComment,
  onComment
}) => {
  const [isLiked, toggleLike] = useToggle(liked)
  const associatorIcon = user.vipRights?.associator?.iconUrl
  const musicPackageIcon = user.vipRights?.musicPackage?.iconUrl
  const isShowExactTime = (new Date(time).getDay() + 1) - (new Date().getDay() + 1) > 0
  const IP = ip || '未知'
  const placeholder = `回复 @${user.nickname}：`
  const exactTime = format(new Date(time), 'HH:mm')

  const handleSendComment: SendHandler = (content) => {
    comment({
      id: songId,
      type: Comment.Song,
      action: CommentAction.Send,
      content,
      commentId: id
    })
  }

  const handleLike = () => {
    commentLike({
      id: songId,
      cid: id,
      type: Comment.Song,
      like: !isLiked
    })
      .then(({ data }) => {
        if (data.code === 200) {
          toggleLike()
        }
      })
      .catch(() => toast.error('点赞失败'))
  }

  const handleComment = () => {
    onComment(id)
  }

  return (
    <Fragment>
      <li className="flex items-center gap-x-4">
        {/* 头像 */}
        <Avatar 
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
            {/* 子评论 */}
            {beReplied.length > 0 && <ul className="p-2 my-2 space-y-2 bg-gray-200 text-sm rounded-md">
              {
                beReplied.map(({
                  content,
                  user,
                  beRepliedCommentId: id
                }) => (
                  <li key={id}>
                    <h4 className="float-left text-sky-500 hover:text-sky-700">@{user.nickname}</h4>
                    <p>：{content}</p>
                  </li>
                ))
              }
            </ul>}
          </div>
          <div className="w-full flex justify-between">
            <span className="text-xs text-gray-500">{timeStr}&nbsp;&nbsp;{isShowExactTime && exactTime}</span>
            <div className="inline-flex gap-x-4 items-center">
              <span onClick={handleLike} className={clsx('inline-flex cursor-pointer gap-x-1 items-center', isLiked ? 'text-sky-500 animate-jump-once' : 'text-sky-900')}>
                <Icon icon="ph:thumbs-up-duotone" />
                {likedCount > 0 && <span>{likedCount}</span>}
              </span>
              {isOwner && <Icon className="cursor-pointer text-sky-900" icon="mdi:comment-remove" />}
              <Icon onClick={handleComment} className={clsx('cursor-pointer', isComment ? 'text-sky-500' : 'text-sky-900')} icon="mdi:comment-processing" />
            </div>
          </div>
        </div>
      </li>
      {isComment && <CommentInput placeholder={placeholder} onSend={handleSendComment} />}
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