import * as ScrollArea from '@radix-ui/react-scroll-area'
import Button from '../Button/Button'
import { Comment, SongCommentState } from '../Player/SongDetails'
import SongComment, { CommentHandler } from './SongComment'
import { useEffect, useRef, useState } from 'react'
import useScrollBottom from '~/hooks/useScrollBottom'
import { commentFloors } from '~/api/comment'
import { Comment as CommentType } from '~/types/comment'

interface SongReplyCommentsProps {
  songId: number;
  onClose: () => void;
  replyCommentId?: number;
}

interface ReplyCommentState extends Omit<SongCommentState, 'cursor' | 'sortType'> {
  ownerComment: Comment;
}

const SongReplyComments: React.FC<SongReplyCommentsProps> = ({
  songId,
  onClose,
  replyCommentId
}) => {
  const [commentId, setCommentId] = useState<number>()
  // 查看评论的回复评论状态
  const [replyCommentState, setReplyCommentState] = useState<ReplyCommentState>()
  const scrollViewportRef = useRef<HTMLDivElement | null>(null)

  const handleReplyComment = (comment: Comment) => {
    setReplyCommentState({
      ...replyCommentState!,
      comments: [...replyCommentState!.comments, comment]
    })
  }

  const handleComment: CommentHandler = (id) => {
    if (!id) return
    if (commentId === id) {
      setCommentId(undefined)
    } else {
      setCommentId(id)
    }
  }

  useScrollBottom({
    ref: scrollViewportRef,
    callback: () => {
      if (!replyCommentState) return

      const comments = replyCommentState.comments

      commentFloors({
        id: songId,
        type: CommentType.Song,
        parentCommentId: replyCommentState.ownerComment.commentId,
        beforeLastTime: comments[comments.length - 1]?.time
      })
        .then(({ data }) => {
          setReplyCommentState({
            ...replyCommentState,
            comments: [...replyCommentState.comments, ...data.comments]
          })
        })
    }
  })

  // 获取回复的评论
  useEffect(() => {
    if (!replyCommentId) return
    if (replyCommentState?.ownerComment?.commentId === replyCommentId) {
      onClose()
      return
    }

    commentFloors({
      id: songId,
      parentCommentId: replyCommentId,
      type: CommentType.Song,
    })
      .then(({ data }) => {
        setReplyCommentState(data)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId, replyCommentId])

  return (
    <ScrollArea.Root type="scroll" className="w-full h-[calc(100%-57px)]">
      <div className="px-4 py-2 border-b flex items-center justify-between">
        <h3 className="truncate w-32">
          回复@{replyCommentState?.ownerComment?.user?.nickname}的评论
        </h3>
        <Button
          className="hover:text-sky-500"
          fontSize={24}
          variant="custom"
          icon="material-symbols:close"
          onClick={onClose}
        />
      </div>
      <ScrollArea.Viewport ref={scrollViewportRef} className="h-full">
        <ul className="p-4 space-y-4">
          {
            replyCommentState?.comments?.map(({
              commentId: cid,
              owner,
              content,
              richContent,
              replyCount,
              likedCount,
              liked,
              user,
              time,
              timeStr,
              beReplied,
              ipLocation,
              pendantData
            }) => (
              <SongComment
                key={time}
                id={cid}
                songId={songId}
                isComment={cid === commentId}
                avatarFrameSrc={pendantData?.imageUrl}
                isOwner={owner}
                content={richContent || content}
                replyCount={replyCount}
                likedCount={likedCount}
                liked={liked}
                user={user}
                time={time}
                timeStr={timeStr}
                beReplied={beReplied || []}
                onShowReplyComment={() => { }}
                onReplyComment={handleReplyComment}
                onComment={handleComment}
                ip={ipLocation.location}
              >
                {
                  ({ beRepliedCommentId, content, user }) => (
                    beRepliedCommentId !== replyCommentId && (
                      <p className="p-1 rounded bg-gray-300">@{user.nickname}：{content}</p>
                    )
                  )
                }
              </SongComment>
            ))
          }
        </ul>
        {
          replyCommentState?.comments.length === replyCommentState?.totalCount &&
          (<p className="my-4 text-gray-500 text-sm text-center">到底啦</p>)
        }
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="h-full w-1.5">
        <ScrollArea.Thumb className="w-full rounded-full bg-gray-300 cursor-pointer" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

export default SongReplyComments